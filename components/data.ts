import { useState, useEffect } from 'react';
import type { ApiPilot } from '../lib/api';

/* ============================================================
   PILOTAGE — formatting helpers + real-data mappers (no mocks)
   ============================================================ */

export const fmtUsd = (n: number) => {
  if (n >= 1e9) return '$' + (n / 1e9).toFixed(2) + 'B';
  if (n >= 1e6) return '$' + (n / 1e6).toFixed(2) + 'M';
  if (n >= 1e3) return '$' + (n / 1e3).toFixed(1) + 'K';
  return '$' + n.toFixed(2);
};

export const fmtPct = (n: number) => (n >= 0 ? '+' : '') + n.toFixed(1) + '%';

export const shortAddr = (a?: string) => (a ? `${a.slice(0, 6)}…${a.slice(-4)}` : '');

// deterministic pseudo-random walk for sparkline decoration, seeded per pilot.
export function series(seed: number, n: number, vol: number, up: boolean) {
  const out: number[] = [];
  let v = 50;
  let s = seed || 1;
  const rnd = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
  for (let i = 0; i < n; i++) {
    v += (rnd() - 0.5) * vol + (up ? vol * 0.16 : -vol * 0.02);
    v = Math.max(8, Math.min(96, v));
    out.push(v);
  }
  return out;
}

export type UiRisk = 'low' | 'balanced' | 'high';

export function toUiRisk(riskProfile: string): UiRisk {
  const r = (riskProfile || '').toLowerCase();
  if (r.includes('conservative') || r.includes('steady') || r.includes('low')) return 'low';
  if (r.includes('aggressive') || r.includes('high')) return 'high';
  return 'balanced';
}

const PALETTE = ['#2E6E8E', '#2C8A5B', '#B8843C', '#6B57C4', '#C0573B', '#1F9DAE'];
export const pilotColor = (id: number) => PALETTE[id % PALETTE.length];
export const initialsOf = (name: string) =>
  (name.replace(/[a-z]/g, '').slice(0, 2) || name.slice(0, 2)).toUpperCase();

// A pilot as rendered on the landing — derived entirely from on-chain / indexer data.
export interface Pilot {
  id: string;
  name: string;
  handle: string;        // short operator address
  color: string;
  risk: UiRisk;
  score: number;         // ERC-8004 Pilotage Score
  stakeUsd: number;      // staked bond in USDC
  description: string;
  spark: number[];
}

export function enrichApiPilot(api: ApiPilot): Pilot {
  const id = Number(api.id);
  return {
    id: api.id.toString(),
    name: api.name || `Pilot #${api.id}`,
    handle: shortAddr(api.operator),
    color: pilotColor(id),
    risk: toUiRisk(api.risk_profile),
    score: api.pilotage_score ?? 0,
    stakeUsd: api.staked_amount ? Number(api.staked_amount) / 1e6 : 0,
    description: api.description || 'No description provided.',
    spark: series(id * 7 + (api.pilotage_score ?? 0), 40, 6, true),
  };
}

// Illustrative activity timeline shown in the "Live demo" section. It mirrors the
// real flow: oracle marks aUSDC up → drift → AI sizes the move → Aave rebalance.
export interface FeedItem {
  kind: string;
  marker: string;
  ttl: string;
  sub: string;
  ts: string;
  tx?: string;
}

export const DEMO_FEED: FeedItem[] = [
  { kind: 'watch', marker: '#6E909B', ttl: 'Watching vault · USDC / aUSDC on course', sub: 'Drift 0.0% · within the 5% charter band', ts: '09:41:02' },
  { kind: 'detect', marker: '#C98A2B', ttl: 'Drift detected · aUSDC marked up', sub: 'aUSDC → $1.40 · allocation now 58% vs 50% target', ts: '09:41:18' },
  { kind: 'compute', marker: '#1F9DAE', ttl: 'AI decision engine evaluating', sub: 'Gemini sizes a corrective withdraw · charter preflight passes', ts: '09:41:22', tx: 'fraction 0.86' },
  { kind: 'submit', marker: '#2E6E8E', ttl: 'Executing rebalance on Aave V3', sub: 'Withdraw aUSDC → USDC · within per-action & daily caps', ts: '09:41:26', tx: '0x9f2a…c41e' },
  { kind: 'safe', marker: '#2C8A5B', ttl: 'Safe passage · back on course', sub: 'Allocation restored ~50/50 · +1 posted to ERC-8004', ts: '09:41:31' },
];

export const HOLDINGS = [
  { sym: 'USDC', name: 'Idle USDC', color: '#2C8A5B', target: 50 },
  { sym: 'aUSDC', name: 'Aave USDC yield', color: '#2E6E8E', target: 50 },
];

// The real stack Pilotage is built on.
export const ECO = [
  { ic: 'badge', t: 'ERC-8004', d: 'On-chain agent reputation' },
  { ic: 'layers', t: 'Arbitrum Sepolia', d: 'Native deployment' },
  { ic: 'coins', t: 'Aave V3', d: 'Yield venue for rebalances' },
  { ic: 'cpu', t: 'Google Gemini', d: 'AI decision engine' },
  { ic: 'shield', t: 'CharterValidator', d: 'On-chain permission guardrails' },
  { ic: 'code', t: 'Foundry · viem · Hono', d: 'Contracts, runtime & indexer' },
];

export const getEnvUrls = () => {
  const envLanding = process.env.NEXT_PUBLIC_LANDING_URL;
  const envDashboard = process.env.NEXT_PUBLIC_DASHBOARD_URL;

  if (envLanding && envDashboard) {
    return { landing: envLanding, dashboard: envDashboard };
  }

  const isLocal = typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ||
      window.location.port === '3000' || window.location.port === '3001' || window.location.port === '3002');

  if (isLocal) {
    return { landing: 'http://localhost:3000', dashboard: 'http://localhost:3002' };
  }
  return {
    landing: 'https://pilotage.arb.vercel.app',
    dashboard: 'https://pilotage-dashboard.onrender.com',
  };
};

export function useEnvUrls() {
  const [urls, setUrls] = useState({
    landing: 'https://pilotage.arb.vercel.app',
    dashboard: 'https://pilotage-dashboard.onrender.com',
  });
  useEffect(() => { setUrls(getEnvUrls()); }, []);
  return urls;
}
