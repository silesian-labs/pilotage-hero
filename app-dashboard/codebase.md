# Pilotage Dashboard — Codebase Export

Ten plik zawiera pełny zbiór kodu źródłowego i konfiguracji utworzonych dla osobnej aplikacji Dashboard (`app-dashboard/`).

---

## Spis Treści
1. [Konfiguracja Projektu](#1-konfiguracja-projektu)
   * `package.json`
   * `tsconfig.json`
   * `next.config.ts`
   * `postcss.config.mjs`
   * `eslint.config.mjs`
2. [Komponenty Wspólne i Dane](#2-komponenty-wspólne-i-dane)
   * `components/ui.tsx`
   * `components/data.ts`
3. [Główna Logika Stanu i Style](#3-główna-logika-stanu-i-style)
   * `app/state.tsx`
   * `app/globals.css`
   * `app/layout.tsx`
4. [Widoki i Podstrony](#4-widoki-i-podstrony)
   * `app/page.tsx`
   * `app/harbor/page.tsx`
   * `app/pilot/[id]/page.tsx`
   * `app/vault/create/page.tsx`

---

## 1. Konfiguracja Projektu

### `package.json`
```json
{
  "name": "pilotage-dashboard",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev -p 3001",
    "build": "next build",
    "start": "next start -p 3001",
    "lint": "eslint"
  },
  "dependencies": {
    "next": "16.2.6",
    "react": "19.2.4",
    "react-dom": "19.2.4"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "16.2.6",
    "tailwindcss": "^4",
    "typescript": "^5"
  }
}
```

### `tsconfig.json`
```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts",
    "**/*.mts"
  ],
  "exclude": ["node_modules"]
}
```

### `next.config.ts`
```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
```

### `postcss.config.mjs`
```javascript
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
```

### `eslint.config.mjs`
```javascript
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
```

---

## 2. Komponenty Wspólne i Dane

### `components/ui.tsx`
```tsx
"use client";

import React, { useEffect, useState } from 'react';
import { useEnvUrls } from './data';

// ---------- Icon (simple geometric line set) ----------
export const ICONS: Record<string, string> = {
  anchor: 'M12 7v13M12 4a2 2 0 1 0 0 .01M5 12H3a9 9 0 0 0 18 0h-2M5 12a7 7 0 0 0 14 0',
  compass: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM15.5 8.5l-2 5-5 2 2-5 5-2Z',
  wheel: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7ZM12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1',
  shield: 'M12 3l7 3v5c0 4.5-3 7.7-7 9-4-1.3-7-4.5-7-9V6l7-3Z',
  shieldcheck: 'M12 3l7 3v5c0 4.5-3 7.7-7 9-4-1.3-7-4.5-7-9V6l7-3ZM9 11.5l2 2 4-4',
  key: 'M14.5 9.5a3.5 3.5 0 1 1-4.6 4.6L4 20H2v-2l6-6M14.5 9.5L20 4M14.5 9.5l2 2M20 4l-2-2',
  route: 'M6 19a2 2 0 1 0 0-.01M18 5a2 2 0 1 0 0-.01M8 19h6a3 3 0 0 0 3-3V8M16 5h-6a3 3 0 0 0-3 3v9',
  badge: 'M12 15a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM9.5 13.5L8 21l4-2 4 2-1.5-7.5',
  cpu: 'M7 7h10v10H7zM4 9v6M4 9h3M4 15h3M20 9v6M17 9h3M17 15h3M9 4h6M9 4v3M15 4v3M9 20h6M9 17v3M15 17v3',
  layers: 'M12 3l9 5-9 5-9-5 9-5ZM3 13l9 5 9-5M3 17l9 5 9-5',
  stock: 'M4 19V5M4 19h16M8 15l3-4 3 2 4-6',
  lock: 'M6 11h12v9H6zM8 11V8a4 4 0 0 1 8 0v3',
  chart: 'M4 19V5M4 19h16M7 15l3-4 3 3 4-7',
  code: 'M9 8l-4 4 4 4M15 8l4 4-4 4',
  scroll: 'M5 4h11a2 2 0 0 1 2 2v12a2 2 0 0 0 2 2H8a2 2 0 0 1-2-2V6a2 2 0 0 0-2-2ZM8 8h7M8 12h7M8 16h4',
  helm: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z',
  arrow: 'M5 12h14M13 6l6 6-6 6',
  ext: 'M14 5h5v5M19 5l-7 7M12 5H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-6',
  check: 'M5 12.5l4.5 4.5L19 7',
  spark: 'M12 3l2 6 6 1-4.5 4 1.2 6L12 17l-5.7 3 1.2-6L3 10l6-1 3-6Z',
  bolt: 'M13 3L5 13h6l-1 8 8-10h-6l1-8Z',
  eye: 'M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7ZM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
  coins: 'M9 13a6 3 0 1 0 0-6 6 3 0 0 0 0 6ZM3 7v5c0 1.7 2.7 3 6 3M3 7c0 1.7 2.7 3 6 3M15 11.5c2.3.4 4 1.4 4 2.5 0 1.7-2.7 3-6 3s-6-1.3-6-3',
  github: 'M9 19c-4 1.5-4-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.3 4.3 0 0 0-.1-3.2s-1-.3-3.5 1.3a12 12 0 0 0-6.3 0C6.5 2.8 5.5 3 5.5 3a4.3 4.3 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.4c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21',
  x: 'M4 4l16 16M20 4L4 20',
  menu: 'M4 7h16M4 12h16M4 17h16',
};

interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: string;
  size?: number;
  sw?: number;
  fill?: string;
}

export function Icon({ name, size = 20, sw = 1.7, fill, style, ...rest }: IconProps) {
  const d = ICONS[name] || ICONS.compass;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
      style={style} {...rest}>
      <path d={d} fill={fill || 'none'} />
    </svg>
  );
}

// ---------- Logo mark (anchor in a brass roundel) ----------
export function Mark({ size = 36 }: { size?: number }) {
  return (
    <span className="brand-mark" style={{ width: size, height: size }}>
      <Icon name="anchor" size={size * 0.56} sw={1.9} style={{ color: '#F2E6CE' }} />
    </span>
  );
}

export function Brand({ size = 36 }: { size?: number }) {
  const urls = useEnvUrls();
  const landingUrl = urls.landing;
  return (
    <a href={landingUrl} className="brand">
      <Mark size={size} />
      <span className="brand-name">Pilotage<span className="dot">.</span></span>
    </a>
  );
}



// ---------- Score ring ----------
export function ScoreRing({ value, size = 72, stroke = 7, label = 'score' }: { value: number; size?: number; stroke?: number; label?: string }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const off = c * (1 - value / 100);
  const hue = value >= 85 ? 'var(--pos)' : value >= 65 ? 'var(--accent)' : value >= 45 ? 'var(--warn)' : 'var(--neg)';
  return (
    <div className="score-ring" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={r} stroke="var(--vellum)" strokeWidth={stroke} fill="none" />
        <circle cx={size / 2} cy={size / 2} r={r} stroke={hue} strokeWidth={stroke} fill="none"
          strokeDasharray={c} strokeDashoffset={off} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1.1s cubic-bezier(.2,.7,.3,1)' }} />
      </svg>
      <div className="val" style={{ fontSize: size * 0.32, color: 'var(--ink)' }}>
        {Math.round(value)}
        {label && <small>{label}</small>}
      </div>
    </div>
  );
}

// ---------- Sparkline / sea-chart area ----------
interface SparklineProps {
  data: number[];
  w?: number;
  h?: number;
  color?: string;
  fillId?: string;
  area?: boolean;
  sw?: number;
}

export function Sparkline({ data, w = 240, h = 56, color = 'var(--accent)', fillId, area = true, sw = 2 }: SparklineProps) {
  const max = Math.max(...data), min = Math.min(...data);
  const span = max - min || 1;
  const pts = data.map((v, i) => [
    (i / (data.length - 1)) * w,
    h - 4 - ((v - min) / span) * (h - 8),
  ]);
  const line = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
  const [fid, setFid] = useState('');
  useEffect(() => {
    setFid(fillId || ('g' + Math.random().toString(36).slice(2, 8)));
  }, [fillId]);

  return (
    <svg className="spark" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ height: h }}>
      {fid && (
        <defs>
          <linearGradient id={fid} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.26" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
      )}
      {area && fid && <path d={`${line} L${w} ${h} L0 ${h} Z`} fill={`url(#${fid})`} />}
      <path d={line} fill="none" stroke={color} strokeWidth={sw} strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

// ---------- Reveal-on-scroll hook ----------
export function useReveal() {
  useEffect(() => {
    const reveal = () => {
      const vh = window.innerHeight || 800;
      document.querySelectorAll('.reveal:not(.in)').forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top < vh * 0.92 && r.bottom > -40) el.classList.add('in');
      });
    };
    reveal();
    const raf = requestAnimationFrame(reveal);
    const t1 = setTimeout(reveal, 180);
    const t2 = setTimeout(reveal, 600);
    window.addEventListener('scroll', reveal, { passive: true });
    window.addEventListener('resize', reveal);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener('scroll', reveal);
      window.removeEventListener('resize', reveal);
    };
  }, []);
}

// ---------- animated count-up ----------
export function useCountUp(target: number, run: boolean, dur = 1200) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!run) return;
    let raf: number, start: number;
    const tick = (t: number) => {
      if (!start) start = t;
      const p = Math.min(1, (t - start) / dur);
      const e = 1 - Math.pow(1 - p, 3);
      setVal(target * e);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, target, dur]);
  return val;
}

// ---------- risk pill ----------
export function RiskPill({ risk }: { risk: 'low' | 'balanced' | 'high' }) {
  const map = { low: ['risk-low', 'Calm waters'], balanced: ['risk-bal', 'Balanced'], high: ['risk-high', 'High seas'] };
  const [cls, label] = map[risk] || map.balanced;
  return <span className={'risk ' + cls}>{label}</span>;
}

// ---------- wave divider ----------
export function Wave({ up = false }: { up?: boolean }) {
  return (
    <svg className={'wave' + (up ? ' up' : '')} viewBox="0 0 1440 64" preserveAspectRatio="none">
      <path d="M0 34 C 180 8 320 8 480 30 C 660 56 820 56 1000 32 C 1180 10 1320 12 1440 30 L1440 64 L0 64 Z" />
    </svg>
  );
}
```

### `components/data.ts`
```typescript
import { useState, useEffect } from 'react';

/* ============================================================
   PILOTAGE — mock data + helpers
   ============================================================ */

export const fmtUsd = (n: number) => {
  if (n >= 1e9) return '$' + (n / 1e9).toFixed(2) + 'B';
  if (n >= 1e6) return '$' + (n / 1e6).toFixed(2) + 'M';
  if (n >= 1e3) return '$' + (n / 1e3).toFixed(1) + 'K';
  return '$' + n.toFixed(0);
};

export const fmtPct = (n: number) => (n >= 0 ? '+' : '') + n.toFixed(1) + '%';

// deterministic pseudo-random walk for sparkline series
export function series(seed: number, n: number, vol: number, up: boolean) {
  const out: number[] = [];
  let v = 50;
  let s = seed;
  const rnd = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
  for (let i = 0; i < n; i++) {
    v += (rnd() - 0.5) * vol + (up ? vol * 0.16 : -vol * 0.02);
    v = Math.max(8, Math.min(96, v));
    out.push(v);
  }
  return out;
}

export interface Pilot {
  id: string;
  name: string;
  handle: string;
  color: string;
  risk: 'low' | 'balanced' | 'high';
  chain: string;
  assets: string;
  score: number;
  tvl: number;
  apy: number;
  captains: number;
  age: string;
  compliance: number;
  drawdown: number;
  fee: number;
  blurb: string;
  spark: number[];
  tagset: string[];
}

export const PILOTS: Pilot[] = [
  {
    id: 'conservative-rwa', name: 'ConservativeRWA', handle: '@helmsman.eth',
    color: '#2E6E8E', risk: 'low', chain: 'Robinhood Chain', assets: 'RWA · Stocks',
    score: 87, tvl: 2_340_000, apy: 9.4, captains: 214, age: '6mo track record',
    compliance: 100, drawdown: -3.2, fee: 12,
    blurb: 'Rebalances tokenized equities against Aave USDC yield. Never sails outside a 5% drift band.',
    spark: series(7, 40, 6, true),
    tagset: ['Aave V3', 'TSLA·AMZN·NFLX', 'Drift 5%'],
  },
  {
    id: 'aggressive-yield', name: 'AggressiveYield', handle: '@stormrunner.eth',
    color: '#B8843C', risk: 'high', chain: 'Arbitrum', assets: 'Perps · LP',
    score: 78, tvl: 1_120_000, apy: 31.7, captains: 86, age: '4mo track record',
    compliance: 98, drawdown: -14.6, fee: 20,
    blurb: 'Manages GMX V2 perp exposure and concentrated Uniswap liquidity. Higher seas, higher catch.',
    spark: series(13, 40, 13, true),
    tagset: ['GMX V2', 'Uniswap', 'Leverage 3x'],
  },
  {
    id: 'steady-yield', name: 'SteadyYield', handle: '@ballast.eth',
    color: '#2C8A5B', risk: 'low', chain: 'Arbitrum', assets: 'Stablecoin',
    score: 91, tvl: 5_870_000, apy: 6.8, captains: 402, age: '9mo track record',
    compliance: 100, drawdown: -0.9, fee: 10,
    blurb: 'Pure stablecoin lending across Aave and Compound. The calmest waters in the harbor.',
    spark: series(21, 40, 3.5, true),
    tagset: ['Aave V3', 'Compound', 'USDC·USDT'],
  },
  {
    id: 'delta-neutral', name: 'DeltaNeutral', handle: '@trimmer.eth',
    color: '#6B57C4', risk: 'balanced', chain: 'Arbitrum', assets: 'Perps · Spot',
    score: 83, tvl: 3_010_000, apy: 17.2, captains: 158, age: '5mo track record',
    compliance: 99, drawdown: -6.1, fee: 15,
    blurb: 'Funding-rate harvest with hedged spot. Earns the spread while the hull stays level.',
    spark: series(34, 40, 7, true),
    tagset: ['GMX V2', 'Hedged', 'Funding'],
  },
  {
    id: 'index-pilot', name: 'IndexPilot', handle: '@cartographer.eth',
    color: '#C0573B', risk: 'balanced', chain: 'Robinhood Chain', assets: 'RWA · Index',
    score: 80, tvl: 1_640_000, apy: 14.1, captains: 119, age: '4mo track record',
    compliance: 97, drawdown: -8.7, fee: 15,
    blurb: 'Tracks a tokenized equity basket (PLTR·AMD·NFLX) with quarterly reweighting.',
    spark: series(48, 40, 9, true),
    tagset: ['PLTR·AMD', 'Quarterly', 'Basket'],
  },
  {
    id: 'tide-runner', name: 'TideRunner', handle: '@drifter.eth',
    color: '#1F9DAE', risk: 'high', chain: 'Arbitrum', assets: 'Perps',
    score: 54, tvl: 280_000, apy: 22.4, captains: 12, age: 'untested waters',
    compliance: 94, drawdown: -19.3, fee: 20,
    blurb: 'Momentum perps on majors. New to the harbor, sailing to earn its Pilotage Score.',
    spark: series(60, 40, 16, false),
    tagset: ['GMX V2', 'Momentum', 'New'],
  },
];

export interface FeedItem {
  kind: string;
  marker: string;
  ttl: string;
  sub: string;
  ts: string;
  tx?: string;
}

export const DEMO_FEED: FeedItem[] = [
  { kind: 'watch', marker: '#6E909B', ttl: 'Watching vault, all positions on course', sub: 'Drift 1.2% · within charter band', ts: '09:41:02' },
  { kind: 'detect', marker: '#C98A2B', ttl: 'Drift detected on TSLA exposure', sub: 'TSLA −8.0% · allocation now 33% vs 40% target', ts: '09:41:18' },
  { kind: 'compute', marker: '#1F9DAE', ttl: 'Computing safe passage', sub: 'CharterValidator preflight · 3 venues whitelisted', ts: '09:41:20' },
  { kind: 'submit', marker: '#2E6E8E', ttl: 'Submitting rebalance, buy 7% TSLA', sub: 'Swap aUSDC → TSLA · slippage 0.3% · gas sponsored', ts: '09:41:24', tx: '0x9f2a…c41e' },
  { kind: 'safe', marker: '#2C8A5B', ttl: 'Safe passage, back on course', sub: 'Allocation restored to 60/40 · drift 0.4%', ts: '09:41:31' },
];

export const HOLDINGS = [
  { sym: 'aUSDC', name: 'Aave USDC yield', color: '#2C8A5B', target: 60 },
  { sym: 'TSLA', name: 'Tokenized Tesla', color: '#C0573B', target: 40 },
];

export const ECO = [
  { ic: 'key', t: 'ERC-7715', d: 'Permissioned charters' },
  { ic: 'badge', t: 'ERC-8004', d: 'On-chain reputation' },
  { ic: 'cpu', t: 'Stylus (Rust)', d: 'Hot-path scoring' },
  { ic: 'layers', t: 'Arbitrum', d: 'Native deployment' },
  { ic: 'stock', t: 'Robinhood Chain', d: 'Tokenized equities' },
  { ic: 'shield', t: 'ZeroDev Kernel', d: 'Session keys · gas sponsor' },
];

export const TICKER = [
  { k: 'Total value piloted', v: '$14.3M' },
  { k: 'Active pilots', v: '38' },
  { k: 'Captains aboard', v: '991' },
  { k: 'Safe passages', v: '124,807' },
  { k: 'Charter violations blocked', v: '312' },
  { k: 'Avg Pilotage Score', v: '79 / 100' },
];

export const getEnvUrls = () => {
  const envLanding = process.env.NEXT_PUBLIC_LANDING_URL;
  const envDashboard = process.env.NEXT_PUBLIC_DASHBOARD_URL;
  
  if (envLanding && envDashboard) {
    return {
      landing: envLanding,
      dashboard: envDashboard,
    };
  }

  const isLocal = typeof window !== 'undefined' && 
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.port === '3000' || window.location.port === '3001');
  
  if (isLocal) {
    return {
      landing: 'http://localhost:3000',
      dashboard: 'http://localhost:3001',
    };
  }
  return {
    landing: 'https://pilotage.arb.vercel.app',
    dashboard: 'https://pilotage-dashboard.arb.vercel.app',
  };
};

export function useEnvUrls() {
  const [urls, setUrls] = useState({
    landing: 'https://pilotage.arb.vercel.app',
    dashboard: 'https://pilotage-dashboard.arb.vercel.app',
  });

  useEffect(() => {
    setUrls(getEnvUrls());
  }, []);

  return urls;
}


```

---

## 3. Główna Logika Stanu i Style

### `app/state.tsx`
```tsx
"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { PILOTS, Pilot } from '../components/data';

export interface CharterSettings {
  targets: { sym: string; name: string; target: number; color: string }[];
  maxSingleTx: number;
  maxDailySpend: number;
  slippage: number;
}

export interface VaultLog {
  kind: string;
  marker: string;
  ttl: string;
  sub: string;
  ts: string;
  tx?: string;
}

export interface UserVault {
  id: string;
  address: string;
  chain: string;
  pilotId: string;
  charter: CharterSettings;
  status: 'On course' | 'Off-course, correcting' | 'Paused' | 'Revoked';
  drift: number;
  balanceUsd: number;
  holdings: { sym: string; name: string; target: number; actual: number; color: string }[];
  logs: VaultLog[];
  pilotScore: number;
}

interface DashboardContextType {
  walletConnected: boolean;
  walletAddress: string | null;
  walletName: string | null;
  vaults: UserVault[];
  activeVaultIndex: number;
  rebalancing: boolean;
  connectWallet: (name: string) => void;
  disconnectWallet: () => void;
  deployVault: (chain: string, pilotId: string, charter: CharterSettings) => void;
  depositToVault: (vaultId: string, amount: number) => void;
  withdrawFromVault: (vaultId: string) => void;
  revokePilot: (vaultId: string) => void;
  pausePilot: (vaultId: string) => void;
  unpausePilot: (vaultId: string) => void;
  modifyCharter: (vaultId: string, charter: CharterSettings) => void;
  simulatePriceDrop: (vaultId: string, assetSym: string, pctDrop: number) => void;
  setActiveVaultIndex: (index: number) => void;
  resetAllState: () => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardStateProvider({ children }: { children: React.ReactNode }) {
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [walletName, setWalletName] = useState<string | null>(null);
  const [vaults, setVaults] = useState<UserVault[]>([]);
  const [activeVaultIndex, setActiveVaultIndex] = useState<number>(0);
  const [rebalancing, setRebalancing] = useState(false);

  useEffect(() => {
    const savedConnected = localStorage.getItem('pl_connected');
    const savedAddress = localStorage.getItem('pl_address');
    const savedWalletName = localStorage.getItem('pl_walletName');
    const savedVaults = localStorage.getItem('pl_vaults');

    if (savedConnected === 'true') {
      setWalletConnected(true);
      setWalletAddress(savedAddress);
      setWalletName(savedWalletName);
    }
    if (savedVaults) {
      try {
        setVaults(JSON.parse(savedVaults));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const saveState = (conn: boolean, addr: string | null, wName: string | null, vts: UserVault[]) => {
    localStorage.setItem('pl_connected', String(conn));
    if (addr) localStorage.setItem('pl_address', addr);
    else localStorage.removeItem('pl_address');
    if (wName) localStorage.setItem('pl_walletName', wName);
    else localStorage.removeItem('pl_walletName');
    localStorage.setItem('pl_vaults', JSON.stringify(vts));
  };

  const connectWallet = (name: string) => {
    const addresses: Record<string, string> = {
      MetaMask: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
      Rainbow: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
      'Coinbase Wallet': '0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65',
      WalletConnect: '0x90F79bf6EB2c4f870365E785982E1f101E93b906',
    };
    const addr = addresses[name] || '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC';
    setWalletConnected(true);
    setWalletAddress(addr);
    setWalletName(name);
    saveState(true, addr, name, vaults);
  };

  const disconnectWallet = () => {
    setWalletConnected(false);
    setWalletAddress(null);
    setWalletName(null);
    saveState(false, null, null, vaults);
  };

  const deployVault = (chain: string, pilotId: string, charter: CharterSettings) => {
    const mockAddress = '0x' + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    const pilot = PILOTS.find(p => p.id === pilotId) || PILOTS[0];

    const initialHoldings = charter.targets.map(t => ({
      sym: t.sym,
      name: t.name,
      target: t.target,
      actual: t.target,
      color: t.color
    }));

    const formattedTime = () => new Date().toTimeString().split(' ')[0];

    const newVault: UserVault = {
      id: Math.random().toString(36).substring(2, 9),
      address: mockAddress.substring(0, 6) + '...' + mockAddress.substring(36),
      chain,
      pilotId,
      charter,
      status: 'On course',
      drift: 0.0,
      balanceUsd: 10000.0,
      holdings: initialHoldings,
      pilotScore: pilot.score,
      logs: [
        {
          kind: 'info',
          marker: '#6E909B',
          ttl: 'Vault Deployed on ' + chain,
          sub: `Smart contract deployed at ${mockAddress.substring(0, 14)}...`,
          ts: formattedTime()
        },
        {
          kind: 'info',
          marker: '#2E6E8E',
          ttl: `Hired Pilot: ${pilot.name}`,
          sub: 'ERC-7715 charter signature registered. Sponsoring initial operations.',
          ts: formattedTime()
        },
        {
          kind: 'watch',
          marker: '#6E909B',
          ttl: 'Watching vault, all positions on course',
          sub: 'Drift 0.0% · within charter band',
          ts: formattedTime()
        }
      ]
    };

    const updatedVaults = [...vaults, newVault];
    setVaults(updatedVaults);
    setActiveVaultIndex(updatedVaults.length - 1);
    saveState(walletConnected, walletAddress, walletName, updatedVaults);
  };

  const depositToVault = (vaultId: string, amount: number) => {
    const updated = vaults.map(v => {
      if (v.id === vaultId) {
        const updatedLogs = [
          ...v.logs,
          {
            kind: 'deposit',
            marker: '#2C8A5B',
            ttl: 'Deposit Registered',
            sub: `Funded vault with +${amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}`,
            ts: new Date().toTimeString().split(' ')[0]
          }
        ];
        return {
          ...v,
          balanceUsd: v.balanceUsd + amount,
          logs: updatedLogs
        };
      }
      return v;
    });
    setVaults(updated);
    saveState(walletConnected, walletAddress, walletName, updated);
  };

  const withdrawFromVault = (vaultId: string) => {
    const updated = vaults.map(v => {
      if (v.id === vaultId) {
        const withdrawnAmt = v.balanceUsd;
        const updatedLogs = [
          ...v.logs,
          {
            kind: 'withdraw',
            marker: '#C0573B',
            ttl: 'Force Withdraw Executed',
            sub: `Returned all ${withdrawnAmt.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} to your wallet EOA`,
            ts: new Date().toTimeString().split(' ')[0]
          }
        ];
        return {
          ...v,
          balanceUsd: 0,
          holdings: v.holdings.map(h => ({ ...h, actual: 0 })),
          logs: updatedLogs,
          status: 'Paused' as const
        };
      }
      return v;
    });
    setVaults(updated);
    saveState(walletConnected, walletAddress, walletName, updated);
  };

  const revokePilot = (vaultId: string) => {
    const updated = vaults.map(v => {
      if (v.id === vaultId) {
        return {
          ...v,
          status: 'Revoked' as const,
          logs: [
            ...v.logs,
            {
              kind: 'revoke',
              marker: '#C0573B',
              ttl: 'Hired Pilot Revoked',
              sub: 'ERC-7715 charter keys revoked. Pilot can no longer perform actions.',
              ts: new Date().toTimeString().split(' ')[0]
            }
          ]
        };
      }
      return v;
    });
    setVaults(updated);
    saveState(walletConnected, walletAddress, walletName, updated);
  };

  const pausePilot = (vaultId: string) => {
    const updated = vaults.map(v => {
      if (v.id === vaultId) {
        return {
          ...v,
          status: 'Paused' as const,
          logs: [
            ...v.logs,
            {
              kind: 'pause',
              marker: '#C98A2B',
              ttl: 'Charter Execution Paused',
              sub: 'Suspended pilot execution. Manual reactivation required.',
              ts: new Date().toTimeString().split(' ')[0]
            }
          ]
        };
      }
      return v;
    });
    setVaults(updated);
    saveState(walletConnected, walletAddress, walletName, updated);
  };

  const unpausePilot = (vaultId: string) => {
    const updated = vaults.map(v => {
      if (v.id === vaultId) {
        return {
          ...v,
          status: 'On course' as const,
          logs: [
            ...v.logs,
            {
              kind: 'unpause',
              marker: '#2C8A5B',
              ttl: 'Charter Execution Resumed',
              sub: 'Pilot active. Resumed watch rules.',
              ts: new Date().toTimeString().split(' ')[0]
            }
          ]
        };
      }
      return v;
    });
    setVaults(updated);
    saveState(walletConnected, walletAddress, walletName, updated);
  };

  const modifyCharter = (vaultId: string, charter: CharterSettings) => {
    const updated = vaults.map(v => {
      if (v.id === vaultId) {
        const newHoldings = charter.targets.map(t => {
          const old = v.holdings.find(o => o.sym === t.sym);
          return {
            sym: t.sym,
            name: t.name,
            target: t.target,
            actual: old ? old.actual : t.target,
            color: t.color
          };
        });

        let driftSum = 0;
        newHoldings.forEach(h => {
          driftSum += Math.abs(h.actual - h.target);
        });
        const drift = driftSum / 2;

        return {
          ...v,
          charter,
          holdings: newHoldings,
          drift,
          logs: [
            ...v.logs,
            {
              kind: 'info',
              marker: '#2E6E8E',
              ttl: 'Charter Parameters Modified',
              sub: 'ERC-7715 keys updated with new whitelists and limits.',
              ts: new Date().toTimeString().split(' ')[0]
            }
          ]
        };
      }
      return v;
    });
    setVaults(updated);
    saveState(walletConnected, walletAddress, walletName, updated);
  };

  const simulatePriceDrop = (vaultId: string, assetSym: string, pctDrop: number) => {
    if (rebalancing) return;

    const vault = vaults.find(v => v.id === vaultId);
    if (!vault || vault.status === 'Paused' || vault.status === 'Revoked') return;

    setRebalancing(true);

    const targetAssetIndex = vault.holdings.findIndex(h => h.sym === assetSym);
    if (targetAssetIndex === -1) {
      setRebalancing(false);
      return;
    }

    const updatedHoldings = vault.holdings.map((h, i) => {
      if (h.sym === assetSym) {
        const droppedVal = h.actual * (1 + pctDrop / 100);
        return { ...h, actual: Number(droppedVal.toFixed(1)) };
      }
      return h;
    });

    const sumActual = updatedHoldings.reduce((sum, h) => sum + h.actual, 0);
    const deficit = 100 - sumActual;
    const nonTargetHoldingsCount = updatedHoldings.length - 1;
    
    const holdingsWithDrop = updatedHoldings.map(h => {
      if (h.sym !== assetSym && nonTargetHoldingsCount > 0) {
        return { ...h, actual: Number((h.actual + deficit / nonTargetHoldingsCount).toFixed(1)) };
      }
      return h;
    });

    let driftSum = 0;
    holdingsWithDrop.forEach(h => {
      driftSum += Math.abs(h.actual - h.target);
    });
    const calculatedDrift = Number((driftSum / 2).toFixed(1));

    let stateVaults = vaults.map(v => {
      if (v.id === vaultId) {
        return {
          ...v,
          holdings: holdingsWithDrop,
          drift: calculatedDrift,
          status: 'Off-course, correcting' as const,
          logs: [
            ...v.logs,
            {
              kind: 'detect',
              marker: '#C98A2B',
              ttl: `Drift detected on ${assetSym} exposure`,
              sub: `${assetSym} ${pctDrop >= 0 ? '+' : ''}${pctDrop}% · allocation now ${holdingsWithDrop[targetAssetIndex].actual}% vs ${holdingsWithDrop[targetAssetIndex].target}% target`,
              ts: new Date().toTimeString().split(' ')[0]
            }
          ]
        };
      }
      return v;
    });
    setVaults(stateVaults);
    saveState(walletConnected, walletAddress, walletName, stateVaults);

    const timers = [
      {
        delay: 1000,
        action: (currVaults: UserVault[]) => currVaults.map(v => {
          if (v.id === vaultId) {
            return {
              ...v,
              logs: [
                ...v.logs,
                {
                  kind: 'compute',
                  marker: '#1F9DAE',
                  ttl: 'Computing safe passage',
                  sub: 'CharterValidator preflight · limits whitelisted · slippage acceptable',
                  ts: new Date().toTimeString().split(' ')[0]
                }
              ]
            };
          }
          return v;
        })
      },
      {
        delay: 2500,
        action: (currVaults: UserVault[]) => currVaults.map(v => {
          if (v.id === vaultId) {
            const txHash = '0x' + Array.from({ length: 8 }, () => Math.floor(Math.random() * 16).toString(16)).join('') + '...' + Array.from({ length: 4 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
            const tradeText = holdingsWithDrop[targetAssetIndex].actual < holdingsWithDrop[targetAssetIndex].target 
              ? `Swap aUSDC → ${assetSym} · buy ${Number((holdingsWithDrop[targetAssetIndex].target - holdingsWithDrop[targetAssetIndex].actual).toFixed(1))}% ${assetSym}`
              : `Swap ${assetSym} → aUSDC · sell ${Number((holdingsWithDrop[targetAssetIndex].actual - holdingsWithDrop[targetAssetIndex].target).toFixed(1))}% ${assetSym}`;
            return {
              ...v,
              logs: [
                ...v.logs,
                {
                  kind: 'submit',
                  marker: '#2E6E8E',
                  ttl: `Submitting rebalance UserOp`,
                  sub: `${tradeText} · gas sponsored via ZeroDev`,
                  ts: new Date().toTimeString().split(' ')[0],
                  tx: txHash
                }
              ]
            };
          }
          return v;
        })
      },
      {
        delay: 4000,
        action: (currVaults: UserVault[]) => currVaults.map(v => {
          if (v.id === vaultId) {
            const restoredHoldings = v.holdings.map(h => ({ ...h, actual: h.target }));
            const scoreIncr = Number((v.pilotScore + 0.1).toFixed(1));

            return {
              ...v,
              holdings: restoredHoldings,
              drift: 0.2,
              status: 'On course' as const,
              pilotScore: scoreIncr,
              logs: [
                ...v.logs,
                {
                  kind: 'safe',
                  marker: '#2C8A5B',
                  ttl: 'Safe passage, back on course',
                  sub: `Allocation restored to ${restoredHoldings.map(h => h.target).join('/')} · drift 0.2%`,
                  ts: new Date().toTimeString().split(' ')[0]
                }
              ]
            };
          }
          return v;
        })
      }
    ];

    let runningChain = Promise.resolve();

    timers.forEach((t) => {
      runningChain = runningChain.then(() => new Promise((resolve) => {
        setTimeout(() => {
          setVaults(prevVaults => {
            const nextVal = t.action(prevVaults);
            saveState(walletConnected, walletAddress, walletName, nextVal);
            return nextVal;
          });
          resolve();
        }, t.delay);
      }));
    });

    runningChain.then(() => {
      setRebalancing(false);
    });
  };

  const resetAllState = () => {
    localStorage.clear();
    setWalletConnected(false);
    setWalletAddress(null);
    setWalletName(null);
    setVaults([]);
    setActiveVaultIndex(0);
    setRebalancing(false);
  };

  return (
    <DashboardContext.Provider value={{
      walletConnected,
      walletAddress,
      walletName,
      vaults,
      activeVaultIndex,
      rebalancing,
      connectWallet,
      disconnectWallet,
      deployVault,
      depositToVault,
      withdrawFromVault,
      revokePilot,
      pausePilot,
      unpausePilot,
      modifyCharter,
      simulatePriceDrop,
      setActiveVaultIndex,
      resetAllState
    }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboardState() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboardState must be used within a DashboardStateProvider');
  }
  return context;
}
```

### `app/globals.css`
Ze względu na długość pliku (powtórzenie tokenów, klas tła i komponentów landing page z drobnymi modyfikacjami dla suwaków formularzy) kod ten znajduje się w repozytorium w pliku [app-dashboard/app/globals.css](file:///home/jakub/pilotage-hero/app-dashboard/app/globals.css).

### `app/layout.tsx`
```tsx
"use client";

import React, { useState } from 'react';
import { DashboardStateProvider, useDashboardState } from './state';
import { Icon, Brand } from '../components/ui';
import "./globals.css";

function WalletConnectModal({ onClose }: { onClose: () => void }) {
  const { connectWallet } = useDashboardState();
  const wallets = [
    ['MetaMask', '🦊', '#F6851B'],
    ['Rainbow', '🌈', '#5B7FFF'],
    ['WalletConnect', '🔗', '#3B99FC'],
    ['Coinbase Wallet', '🔵', '#0052FF'],
  ];

  return (
    <div className="modal-veil" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
          <h3 className="h2" style={{ fontSize: 22 }}>Come aboard</h3>
          <button className="btn btn-ghost btn-sm" onClick={onClose} style={{ padding: 8 }}>
            <Icon name="x" size={16} />
          </button>
        </div>
        <p style={{ color: 'var(--ink-2)', fontSize: 14.5, marginBottom: 8 }}>
          Connect a wallet to manage or deploy your vault. Pilotage never takes custody.
        </p>
        {wallets.map(([name, emoji, color]) => (
          <button
            key={name}
            className="wallet-opt"
            onClick={() => {
              connectWallet(name);
              onClose();
            }}
          >
            <span className="ic" style={{ background: color + '22' }}>{emoji}</span>
            <span style={{ fontWeight: 600 }}>{name}</span>
            <Icon name="arrow" size={16} style={{ marginLeft: 'auto', color: 'var(--ink-3)' }} />
          </button>
        ))}
        <p className="mono" style={{ fontSize: 11.5, color: 'var(--ink-3)', marginTop: 16, textAlign: 'center' }}>
          <Icon name="lock" size={12} style={{ verticalAlign: '-2px', marginRight: 4 }} />
          Self-custodial · gas sponsored on first charter
        </p>
      </div>
    </div>
  );
}

function Header() {
  const { walletConnected, walletAddress, walletName, disconnectWallet } = useDashboardState();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <nav className="nav scrolled">
        <div className="wrap nav-inner">
          <Brand />
          <div className="nav-links">
            <a className="nav-link" href="/">Dashboard</a>
            <a className="nav-link" href="/harbor">Harbor</a>
          </div>
          <div className="nav-spacer" />
          <div>
            {walletConnected && walletAddress ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span className="chip live" style={{ background: 'var(--paper-raise)', textTransform: 'none', fontFamily: 'var(--font-mono)' }}>
                  <span className="pulse" />
                  {walletName}: {walletAddress.substring(0, 6)}...{walletAddress.substring(38)}
                </span>
                <button className="btn btn-ghost btn-sm" onClick={disconnectWallet} title="Disconnect">
                  <Icon name="x" size={14} />
                </button>
              </div>
            ) : (
              <button className="btn btn-primary btn-sm" onClick={() => setModalOpen(true)}>
                <Icon name="anchor" size={14} /> Connect wallet
              </button>
            )}
          </div>
        </div>
      </nav>
      {modalOpen && <WalletConnectModal onClose={() => setModalOpen(false)} />}
    </>
  );
}

function Footer() {
  return (
    <footer className="footer" style={{ marginTop: 'auto' }}>
      <div className="wrap">
        <div className="footer-bottom" style={{ borderTop: 'none', marginTop: 0, paddingTop: 0 }}>
          <span>© 2026 Pilotage · Where capital finds its pilot.</span>
          <span>Arbitrum Sepolia · Robinhood Chain testnet · 46630</span>
        </div>
      </div>
    </footer>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>Pilotage Dashboard</title>
        <meta name="description" content="Manage your self-custodial smart vaults and delegation charters." />
      </head>
      <body style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', paddingTop: '100px' }}>
        <DashboardStateProvider>
          <Header />
          <main style={{ flex: 1, paddingBottom: '60px' }}>
            {children}
          </main>
          <Footer />
        </DashboardStateProvider>
      </body>
    </html>
  );
}
```

---

## 4. Widoki i Podstrony

### `app/page.tsx`
```tsx
"use client";

import React, { useState } from 'react';
import { useDashboardState, UserVault, CharterSettings } from './state';
import { PILOTS, fmtUsd } from '../components/data';
import { Icon, ScoreRing } from '../components/ui';

export default function DashboardPage() {
  const {
    walletConnected,
    connectWallet,
    vaults,
    activeVaultIndex,
    rebalancing,
    depositToVault,
    withdrawFromVault,
    revokePilot,
    pausePilot,
    unpausePilot,
    modifyCharter,
    simulatePriceDrop,
    setActiveVaultIndex,
    resetAllState
  } = useDashboardState();

  const [depositAmount, setDepositAmount] = useState<string>('5000');
  const [showModifyModal, setShowModifyModal] = useState(false);

  const [splitRatio, setSplitRatio] = useState<number>(60);
  const [maxSingleTx, setMaxSingleTx] = useState<number>(10000);
  const [maxDailySpend, setMaxDailySpend] = useState<number>(30000);
  const [slippage, setSlippage] = useState<number>(0.5);

  const activeVault: UserVault | undefined = vaults[activeVaultIndex];
  const activePilot = activeVault ? PILOTS.find(p => p.id === activeVault.pilotId) : null;

  const handleDeposit = () => {
    if (!activeVault) return;
    const amt = parseFloat(depositAmount);
    if (!isNaN(amt) && amt > 0) {
      depositToVault(activeVault.id, amt);
      setDepositAmount('5000');
    }
  };

  const openModifyModal = () => {
    if (!activeVault) return;
    setSplitRatio(activeVault.charter.targets[0].target);
    setMaxSingleTx(activeVault.charter.maxSingleTx);
    setMaxDailySpend(activeVault.charter.maxDailySpend);
    setSlippage(activeVault.charter.slippage);
    setShowModifyModal(true);
  };

  const handleSaveCharter = () => {
    if (!activeVault) return;
    const targets = activeVault.charter.targets;
    const updatedCharter: CharterSettings = {
      targets: [
        { ...targets[0], target: splitRatio },
        { ...targets[1], target: 100 - splitRatio }
      ],
      maxSingleTx,
      maxDailySpend,
      slippage
    };
    modifyCharter(activeVault.id, updatedCharter);
    setShowModifyModal(false);
  };

  const triggerVolatility = () => {
    if (!activeVault || !activeVault.holdings[1]) return;
    simulatePriceDrop(activeVault.id, activeVault.holdings[1].sym, -8);
  };

  if (vaults.length === 0) {
    return (
      <div className="wrap" style={{ textAlign: 'center', paddingTop: '60px', paddingBottom: '60px' }}>
        <div className="card" style={{ maxWidth: 580, margin: '0 auto', padding: 44 }}>
          <div style={{ width: 64, height: 64, borderRadius: 16, background: 'var(--accent-soft)', color: 'var(--accent-deep)', display: 'grid', placeItems: 'center', margin: '0 auto 24px' }}>
            <Icon name="anchor" size={32} sw={1.8} />
          </div>
          <h1 className="h1" style={{ marginBottom: 14 }}>Deploy your first vault</h1>
          <p className="lead" style={{ fontSize: 16, marginBottom: 28 }}>
            Pilotage is a self-custodial marketplace for automated capital management. To get started, connect your wallet, choose your pilot, and sign a delegation charter.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a className="btn btn-primary btn-lg" href="/harbor">
              <Icon name="compass" size={18} /> Browse the harbor
            </a>
            {walletConnected ? (
              <a className="btn btn-ghost btn-lg" href="/vault/create">
                <Icon name="anchor" size={18} /> Deploy a vault
              </a>
            ) : (
              <button className="btn btn-ghost btn-lg" onClick={() => connectWallet('MetaMask')}>
                <Icon name="key" size={18} /> Connect wallet
              </button>
            )}
          </div>
          <p className="mono" style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 22 }}>
            Sponsor gas on deployment · non-custodial session authorization
          </p>
        </div>
      </div>
    );
  }

  const statusColor = activeVault.status === 'On course' ? 'var(--pos)' 
    : activeVault.status === 'Off-course, correcting' ? 'var(--warn)' 
    : 'var(--ink-3)';

  const driftColor = activeVault.drift < 1.0 ? 'var(--pos)' 
    : activeVault.drift < 5.0 ? 'var(--warn)' 
    : 'var(--neg)';

  return (
    <div className="wrap" style={{ paddingTop: '10px' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, marginBottom: 28 }}>
        <div>
          <span className="kicker">Captain's Control Deck</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 8 }}>
            <h1 className="h2" style={{ margin: 0 }}>Vault {activeVault.address}</h1>
            <span className="chip" style={{ background: 'var(--paper-raise)', textTransform: 'none' }}>
              <Icon name={activeVault.chain === 'Arbitrum' ? 'layers' : 'stock'} size={11} style={{ marginRight: 4 }} />
              {activeVault.chain}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {vaults.length > 1 && (
            <select
              className="sort-select"
              value={activeVaultIndex}
              onChange={(e) => setActiveVaultIndex(Number(e.target.value))}
              style={{ padding: '8px 16px' }}
            >
              {vaults.map((v, i) => (
                <option key={v.id} value={i}>
                  Vault: {v.address} ({v.chain})
                </option>
              ))}
            </select>
          )}
          <a className="btn btn-ghost btn-sm" href="/vault/create">
            <Icon name="anchor" size={13} /> Deploy another
          </a>
          <button className="btn btn-ghost btn-sm" onClick={resetAllState} title="Reset simulation state" style={{ color: 'var(--neg)' }}>
            Reset state
          </button>
        </div>
      </div>

      {activeVault.status === 'On course' && activeVault.balanceUsd > 0 && (
        <div className="sim-panel reveal in">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <h3 style={{ fontSize: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Icon name="bolt" size={16} style={{ color: 'var(--accent)' }} />
                <span>Simulation Control Room</span>
              </h3>
              <p style={{ color: 'var(--ink-2)', fontSize: 13.5, marginTop: 4 }}>
                Simulate market volatility to trigger the pilot. Dropping {activeVault.holdings[1]?.sym} price by -8% will push the vault out of its target charter weights.
              </p>
            </div>
            <button className="btn btn-primary" onClick={triggerVolatility} disabled={rebalancing}>
              <Icon name="bolt" size={15} /> Drop {activeVault.holdings[1]?.sym} −8%
            </button>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 28 }}>
        <div className="metric-card">
          <span className="metric-label">Vault Balance</span>
          <span className="metric-value">{activeVault.balanceUsd.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span>
        </div>
        
        <div className="metric-card">
          <span className="metric-label">Telemetry Status</span>
          <span className="metric-value" style={{ color: statusColor, display: 'flex', alignItems: 'center', gap: 8, fontSize: 20 }}>
            {activeVault.status === 'On course' && <Icon name="check" size={20} />}
            {activeVault.status === 'Off-course, correcting' && <Icon name="route" size={20} className="pulse" />}
            {activeVault.status === 'Paused' && <Icon name="lock" size={20} />}
            {activeVault.status === 'Revoked' && <Icon name="x" size={20} />}
            {activeVault.status}
          </span>
        </div>

        <div className="metric-card">
          <span className="metric-label">Active Drift</span>
          <span className="metric-value" style={{ color: driftColor }}>
            {activeVault.drift.toFixed(1)}%
          </span>
        </div>

        <div className="metric-card">
          <span className="metric-label">Whitelisted Assets</span>
          <span className="metric-value" style={{ fontSize: 18, fontFamily: 'var(--font-body)', marginTop: 4 }}>
            {activeVault.holdings.map(h => h.sym).join(' / ')}
          </span>
        </div>
      </div>

      <div className="dashboard-grid">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          
          <div className="card">
            <div className="card-title">
              <Icon name="chart" size={18} style={{ color: 'var(--accent)' }} />
              <span>Asset Allocations (Target vs. Actual)</span>
            </div>
            <div className="card-body">
              {activeVault.holdings.map(h => (
                <div key={h.sym} className="holding-row">
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ width: 9, height: 9, borderRadius: 3, background: h.color }} />
                      <span style={{ fontWeight: 600, fontSize: 14.5 }}>{h.sym}</span>
                      <span className="mono" style={{ fontSize: 11, color: 'var(--ink-3)' }}>{h.name}</span>
                    </div>
                    <div className="bar">
                      <i style={{ width: `${h.actual}%`, background: h.color }} />
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div className="mono" style={{ fontWeight: 700, fontSize: 16 }}>{h.actual}%</div>
                    <div className="mono" style={{ fontSize: 11, color: Math.abs(h.actual - h.target) > 1 ? 'var(--warn)' : 'var(--ink-3)' }}>
                      target {h.target}%
                    </div>
                  </div>
                </div>
              ))}
              <p className="mono" style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 14 }}>
                *Charter allows a maximum deviation of 5.0% before rebalance triggers.
              </p>
            </div>
          </div>

          {activePilot ? (
            <div className="card">
              <div className="card-title">
                <Icon name="helm" size={18} style={{ color: 'var(--accent)' }} />
                <span>Hired Pilot Details</span>
              </div>
              <div className="card-body" style={{ display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap' }}>
                <div className="pilot-avatar" style={{ width: 60, height: 60, borderRadius: 14, fontSize: 20, background: `linear-gradient(150deg, ${activePilot.color}, ${activePilot.color}cc)` }}>
                  {activePilot.name.replace(/[a-z]/g, '').slice(0, 2)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                    <a href={`/pilot/${activePilot.id}`} style={{ fontWeight: 700, fontSize: 16, textDecoration: 'underline' }}>
                      {activePilot.name}
                    </a>
                    <span className="mono" style={{ color: 'var(--ink-3)', fontSize: 12 }}>{activePilot.handle}</span>
                  </div>
                  <p style={{ fontSize: 13.5, color: 'var(--ink-2)', marginTop: 4 }}>{activePilot.blurb}</p>
                </div>
                
                <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                  <div style={{ textAlign: 'center' }}>
                    <span className="metric-label" style={{ fontSize: 9 }}>APY</span>
                    <div className="mono" style={{ fontWeight: 700, color: 'var(--pos)' }}>+{activeVault.holdings[0]?.actual > 0 ? activePilot.apy : 0.0}%</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <span className="metric-label" style={{ fontSize: 9 }}>Score</span>
                    <div className="mono" style={{ fontWeight: 700 }}>{activeVault.pilotScore.toFixed(1)}</div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="card" style={{ padding: 20, textAlign: 'center', color: 'var(--ink-3)' }}>
              Pilot revoked. Rebalance automation disabled.
            </div>
          )}

          <div className="console">
            <div className="console-bar">
              <span className="dotrow"><i style={{ background: '#C0573B' }} /><i style={{ background: '#C98A2B' }} /><i style={{ background: '#2C8A5B' }} /></span>
              <span className="console-title">pilot · {activePilot?.name || 'none'} · telemetry logs</span>
              {rebalancing && <span style={{ marginLeft: 'auto' }} className="chip live"><span className="pulse" /> rebalancing</span>}
            </div>
            
            <div className="feed" style={{ maxHeight: 320, overflowY: 'auto' }}>
              {[...activeVault.logs].reverse().map((f, i) => (
                <div className="feed-item" key={i}>
                  <div className="tl">
                    <span className="marker" style={{ background: f.marker }} />
                  </div>
                  <div className="body">
                    <div className="ttl">
                      {f.ttl}
                      <span className="ts">{f.ts}</span>
                    </div>
                    <div className="sub">{f.sub}</div>
                    {f.tx && (
                      <span className="txlink" style={{ cursor: 'default' }}>
                        tx: {f.tx}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          
          <div className="card">
            <div className="card-title">
              <Icon name="coins" size={18} style={{ color: 'var(--accent)' }} />
              <span>Capital Operations</span>
            </div>
            <div className="card-body">
              <div className="form-group" style={{ marginBottom: 24 }}>
                <label className="form-label">Deposit mock USDC</label>
                <div style={{ display: 'flex', gap: 10 }}>
                  <input
                    type="number"
                    className="form-input"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    disabled={activeVault.status === 'Revoked'}
                  />
                  <button
                    className="btn btn-primary"
                    onClick={handleDeposit}
                    disabled={activeVault.status === 'Revoked' || rebalancing}
                  >
                    Deposit
                  </button>
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--vellum)', paddingTop: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <span className="form-label">Automation Controls</span>
                
                {activeVault.status === 'Paused' && (
                  <button className="btn btn-ghost" style={{ width: '100%' }} onClick={() => unpausePilot(activeVault.id)} disabled={rebalancing}>
                    <Icon name="check" size={14} style={{ color: 'var(--pos)' }} /> Resume Pilot automation
                  </button>
                )}

                {activeVault.status === 'On course' && (
                  <button className="btn btn-ghost" style={{ width: '100%' }} onClick={() => pausePilot(activeVault.id)} disabled={rebalancing}>
                    <Icon name="lock" size={14} style={{ color: 'var(--warn)' }} /> Pause Pilot automation
                  </button>
                )}

                {activeVault.status !== 'Revoked' && (
                  <button className="btn btn-ghost" style={{ width: '100%', color: 'var(--neg)' }} onClick={() => revokePilot(activeVault.id)} disabled={rebalancing}>
                    <Icon name="x" size={14} /> Revoke Pilot Session Keys
                  </button>
                )}

                <button
                  className="btn btn-ink"
                  style={{ width: '100%', background: 'var(--neg)', borderColor: 'var(--neg)', color: '#fff' }}
                  onClick={() => withdrawFromVault(activeVault.id)}
                  disabled={activeVault.balanceUsd === 0 || rebalancing}
                >
                  <Icon name="lock" size={14} /> Force Withdraw All Capital
                </button>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-title">
              <Icon name="shield" size={18} style={{ color: 'var(--accent)' }} />
              <span>Active Charter Policies</span>
            </div>
            <div className="card-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 18 }}>
                {[
                  ['Single tx limit', `$${activeVault.charter.maxSingleTx.toLocaleString()} USDC`],
                  ['Daily cumulative spend', `$${activeVault.charter.maxDailySpend.toLocaleString()} USDC`],
                  ['Target slippage limit', `${activeVault.charter.slippage}%`],
                  ['Trigger bandwidth', 'Drift >= 5.0%'],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 8, borderBottom: '1px solid var(--vellum-soft)' }} className="mono">
                    <span style={{ fontSize: 11, color: 'var(--ink-3)' }}>{k}</span>
                    <span style={{ fontSize: 13, fontWeight: 700 }}>{v}</span>
                  </div>
                ))}
              </div>
              
              {activeVault.status !== 'Revoked' && (
                <button className="btn btn-primary" style={{ width: '100%' }} onClick={openModifyModal} disabled={rebalancing}>
                  <Icon name="code" size={14} /> Modify Charter Rules
                </button>
              )}
            </div>
          </div>

        </div>
      </div>

      {showModifyModal && (
        <div className="modal-veil" onClick={() => setShowModifyModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <h3 className="h2" style={{ fontSize: 20 }}>Modify Charter Rules</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowModifyModal(false)} style={{ padding: 8 }}>
                <Icon name="x" size={16} />
              </button>
            </div>

            <div className="form-group" style={{ background: 'var(--paper-raise)', border: '1px solid var(--vellum)', borderRadius: 'var(--r)', padding: 14, marginBottom: 18 }}>
              {(() => {
                const targets = activeVault.charter.targets;
                return (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }} className="mono">
                      <span style={{ fontSize: 11.5, fontWeight: 600, color: targets[0].color }}>{targets[0].sym} ({splitRatio}%)</span>
                      <span style={{ fontSize: 11.5, fontWeight: 600, color: targets[1].color }}>{targets[1].sym} ({100 - splitRatio}%)</span>
                    </div>
                    
                    <div style={{ height: 8, borderRadius: 999, display: 'flex', overflow: 'hidden', marginBottom: 12 }}>
                      <div style={{ width: `${splitRatio}%`, background: targets[0].color }} />
                      <div style={{ width: `${100 - splitRatio}%`, background: targets[1].color }} />
                    </div>

                    <input
                      type="range"
                      className="form-slider"
                      min="10"
                      max="90"
                      value={splitRatio}
                      onChange={(e) => setSplitRatio(Number(e.target.value))}
                    />
                  </>
                );
              })()}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" style={{ fontSize: 11 }}>Max single tx limit</label>
                <input
                  type="number"
                  className="form-input"
                  value={maxSingleTx}
                  onChange={(e) => setMaxSingleTx(Number(e.target.value))}
                />
              </div>
              <div className="form-group">
                <label className="form-label" style={{ fontSize: 11 }}>Max daily spend</label>
                <input
                  type="number"
                  className="form-input"
                  value={maxDailySpend}
                  onChange={(e) => setMaxDailySpend(Number(e.target.value))}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <label className="form-label" style={{ fontSize: 11 }}>Max Slippage tolerance</label>
                <span className="mono" style={{ fontSize: 13, fontWeight: 700 }}>{slippage}%</span>
              </div>
              <input
                type="range"
                className="form-slider"
                min="0.1"
                max="2.0"
                step="0.1"
                value={slippage}
                onChange={(e) => setSlippage(Number(e.target.value))}
              />
            </div>

            <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleSaveCharter}>
              Save Charter modifications
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
```

---

### `app/harbor/page.tsx`
```tsx
"use client";

import React, { useState, useMemo } from 'react';
import { PILOTS, Pilot, fmtUsd, fmtPct } from '../../components/data';
import { Icon, ScoreRing, Sparkline, RiskPill } from '../../components/ui';

function PilotCard({ p }: { p: Pilot }) {
  const initials = p.name.replace(/[a-z]/g, '').slice(0, 2);
  
  return (
    <div className="card pilot-card" style={{ display: 'flex', flexDirection: 'column' }}>
      <a href={`/pilot/${p.id}`} style={{ display: 'block', color: 'inherit' }}>
        <div className="pilot-head">
          <div className="pilot-avatar" style={{ background: `linear-gradient(150deg, ${p.color}, ${p.color}cc)` }}>
            {initials}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="pilot-name">{p.name}</div>
            <div className="pilot-handle">{p.handle}</div>
          </div>
          <ScoreRing value={p.score} size={56} stroke={6} label="" />
        </div>

        <p style={{ color: 'var(--ink-2)', fontSize: 13.5, lineHeight: 1.5, minHeight: 40, marginTop: 14 }}>
          {p.blurb}
        </p>

        <div style={{ margin: '12px -22px 0', overflow: 'hidden' }}>
          <Sparkline data={p.spark} h={46} color={p.color} sw={2} />
        </div>

        <div className="pilot-stats" style={{ marginTop: 12 }}>
          <div className="pstat">
            <div className="k">TVL</div>
            <div className="v">{fmtUsd(p.tvl)}</div>
          </div>
          <div className="pstat">
            <div className="k">Net APY</div>
            <div className="v pos">{fmtPct(p.apy)}</div>
          </div>
          <div className="pstat">
            <div className="k">Captains</div>
            <div className="v">{p.captains}</div>
          </div>
        </div>
      </a>

      <div className="pilot-foot" style={{ marginTop: 'auto', paddingTop: 14 }}>
        <div className="tags">
          <RiskPill risk={p.risk} />
          <span className="chip" style={{ fontSize: 10.5, padding: '4px 9px' }}>
            <Icon name={p.chain === 'Arbitrum' ? 'layers' : 'stock'} size={11} style={{ verticalAlign: '-1.5px', marginRight: 3 }} />
            {p.chain}
          </span>
        </div>
        <a className="btn btn-ghost btn-sm" href={`/vault/create?pilot=${p.id}`}>
          Hire <Icon name="arrow" size={15} />
        </a>
      </div>
    </div>
  );
}

export default function Harbor() {
  const [risk, setRisk] = useState('all');
  const [chain, setChain] = useState('all');
  const [sort, setSort] = useState<'score' | 'tvl' | 'apy' | 'captains'>('score');

  const riskOpts = [
    ['all', 'All'],
    ['low', 'Calm'],
    ['balanced', 'Balanced'],
    ['high', 'High seas']
  ];
  
  const chainOpts = [
    ['all', 'All chains'],
    ['Arbitrum', 'Arbitrum'],
    ['Robinhood Chain', 'Robinhood']
  ];

  const filteredList = useMemo(() => {
    const l = PILOTS.filter((p) => {
      const matchRisk = risk === 'all' || p.risk === risk;
      const matchChain = chain === 'all' || p.chain === chain;
      return matchRisk && matchChain;
    });

    const sortingFuncs: Record<string, (a: Pilot, b: Pilot) => number> = {
      score: (a, b) => b.score - a.score,
      tvl: (a, b) => b.tvl - a.tvl,
      apy: (a, b) => b.apy - a.apy,
      captains: (a, b) => b.captains - a.captains
    };

    return [...l].sort(sortingFuncs[sort]);
  }, [risk, chain, sort]);

  return (
    <div className="wrap" style={{ paddingTop: '20px' }}>
      <div className="sec-head" style={{ marginBottom: 32, maxWidth: 960 }}>
        <span className="kicker">The Harbor Marketplace</span>
        <h1 className="h1" style={{ marginTop: 14 }}>
          Browse pilots ranked by reputation,<br />not by marketing budget.
        </h1>
        <p className="lead" style={{ marginTop: 14 }}>
          Filter by risk, network, and strategy. All performance metrics are permanently audited on-chain via ERC-8004.
        </p>
      </div>

      <div className="harbor-toolbar">
        <div className="seg">
          {riskOpts.map(([value, label]) => (
            <button
              key={value}
              className={risk === value ? 'on' : ''}
              onClick={() => setRisk(value)}
            >
              {label}
            </button>
          ))}
        </div>
        
        <div className="seg">
          {chainOpts.map(([value, label]) => (
            <button
              key={value}
              className={chain === value ? 'on' : ''}
              onClick={() => setChain(value)}
            >
              {label}
            </button>
          ))}
        </div>

        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 14 }}>
          <span className="mono" style={{ fontSize: 12, color: 'var(--ink-3)' }}>
            {filteredList.length} pilots found
          </span>
          <select className="sort-select" value={sort} onChange={(e) => setSort(e.target.value as any)}>
            <option value="score">Sort · Pilotage Score</option>
            <option value="tvl">Sort · TVL</option>
            <option value="apy">Sort · Net APY</option>
            <option value="captains">Sort · Captains</option>
          </select>
        </div>
      </div>

      <div className="pilot-grid" style={{ marginTop: '30px' }}>
        {filteredList.map((p) => (
          <PilotCard key={p.id} p={p} />
        ))}
      </div>

      {filteredList.length === 0 && (
        <div className="card" style={{ padding: 60, textAlign: 'center', color: 'var(--ink-3)', marginTop: '30px' }}>
          <Icon name="compass" size={36} style={{ color: 'var(--ink-3)', opacity: 0.6 }} />
          <p style={{ marginTop: 16, fontSize: 16 }}>No pilots match these waters. Try widening your filters.</p>
        </div>
      )}
    </div>
  );
}
```

---

### `app/pilot/[id]/page.tsx`
```tsx
"use client";

import React from 'react';
import { PILOTS, fmtUsd, fmtPct } from '../../../components/data';
import { Icon, ScoreRing, Sparkline, RiskPill } from '../../../components/ui';

type Params = Promise<{ id: string }>;

export default function PilotProfile({ params }: { params: Params }) {
  const { id } = React.use(params);
  const p = PILOTS.find(pilot => pilot.id === id);

  if (!p) {
    return (
      <div className="wrap" style={{ paddingTop: 40, textAlign: 'center' }}>
        <h2 className="h2">Pilot not found in these waters</h2>
        <a href="/harbor" className="btn btn-primary" style={{ marginTop: 20 }}>
          Back to Harbor
        </a>
      </div>
    );
  }

  const initials = p.name.replace(/[a-z]/g, '').slice(0, 2);

  const auditLogs = [
    { ts: '2 days ago', event: 'Safe Passage', detail: 'Rebalanced TSLA/USDC drift of 5.8% back to target. Gas sponsor: $0.12 (Alchemy)', status: 'success' },
    { ts: '5 days ago', event: 'Safe Passage', detail: 'Rebalanced TSLA/USDC drift of 6.2% back to target. Gas sponsor: $0.15 (Alchemy)', status: 'success' },
    { ts: '1 week ago', event: 'Compliance Check', detail: 'Preflight check: whitelisted protocols and daily limit verified.', status: 'success' },
    { ts: '2 weeks ago', event: 'Charter Modified', detail: 'Captain modified target weight from 70/30 to 60/40. Vault 0x7a...c12a', status: 'info' },
  ];

  return (
    <div className="wrap" style={{ paddingTop: '20px' }}>
      
      <a href="/harbor" className="mono" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--ink-3)', marginBottom: 24 }}>
        <Icon name="arrow" size={14} style={{ transform: 'rotate(180deg)' }} /> Return to Harbor
      </a>

      <div className="card" style={{ padding: '30px', marginBottom: 28 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'center' }}>
          <div className="pilot-avatar" style={{ width: 80, height: 80, fontSize: 30, borderRadius: 18, background: `linear-gradient(150deg, ${p.color}, ${p.color}cc)` }}>
            {initials}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
              <h1 className="h1">{p.name}</h1>
              <span className="mono" style={{ color: 'var(--ink-3)', fontSize: 14 }}>{p.handle}</span>
            </div>
            <p className="lead" style={{ marginTop: 8, fontSize: 16, maxWidth: 650 }}>
              {p.blurb}
            </p>
            <div style={{ display: 'flex', gap: 12, marginTop: 14, flexWrap: 'wrap' }}>
              <RiskPill risk={p.risk} />
              <span className="chip">
                <Icon name={p.chain === 'Arbitrum' ? 'layers' : 'stock'} size={12} style={{ verticalAlign: '-1px', marginRight: 4 }} />
                {p.chain}
              </span>
              <span className="chip">{p.age}</span>
            </div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, minWidth: 160 }}>
            <ScoreRing value={p.score} size={84} stroke={8} label="Pilotage Score" />
            <a className="btn btn-primary" href={`/vault/create?pilot=${p.id}`} style={{ width: '100%' }}>
              Hire Pilot <Icon name="arrow" size={16} />
            </a>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 16, marginBottom: 28 }}>
        <div className="metric-card">
          <span className="metric-label">Total Value Piloted</span>
          <span className="metric-value">{fmtUsd(p.tvl)}</span>
        </div>
        <div className="metric-card">
          <span className="metric-label">Audited APY</span>
          <span className="metric-value pos">{fmtPct(p.apy)}</span>
        </div>
        <div className="metric-card">
          <span className="metric-label">Captains Aboard</span>
          <span className="metric-value">{p.captains}</span>
        </div>
        <div className="metric-card">
          <span className="metric-label">Max Drawdown</span>
          <span className="metric-value" style={{ color: 'var(--neg)' }}>{p.drawdown}%</span>
        </div>
        <div className="metric-card">
          <span className="metric-label">Compliance Rate</span>
          <span className="metric-value" style={{ color: 'var(--pos)' }}>{p.compliance}%</span>
        </div>
        <div className="metric-card">
          <span className="metric-label">Performance Fee</span>
          <span className="metric-value">{p.fee}%</span>
        </div>
      </div>

      <div className="dashboard-grid">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          <div className="card">
            <div className="card-title">
              <Icon name="chart" size={18} style={{ color: 'var(--accent)' }} />
              <span>Historical Performance (Net yield index)</span>
            </div>
            <div className="card-body" style={{ padding: '30px 20px 20px' }}>
              <div style={{ height: 180, display: 'flex', alignItems: 'flex-end' }}>
                <Sparkline data={p.spark} h={185} color={p.color} sw={2.5} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }} className="mono">
                <span style={{ fontSize: 11, color: 'var(--ink-3)' }}>T-6 Months</span>
                <span style={{ fontSize: 11, color: 'var(--ink-3)' }}>T-3 Months</span>
                <span style={{ fontSize: 11, color: 'var(--ink-3)' }}>Current Passage</span>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-title">
              <Icon name="scroll" size={18} style={{ color: 'var(--accent)' }} />
              <span>On-Chain Passage History (ERC-8004 Registry)</span>
            </div>
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {auditLogs.map((log, i) => (
                <div key={i} style={{ display: 'flex', gap: 14, paddingBottom: i < auditLogs.length - 1 ? 16 : 0, borderBottom: i < auditLogs.length - 1 ? '1px solid var(--vellum)' : 'none' }}>
                  <div style={{ marginTop: 4 }}>
                    {log.status === 'success' ? (
                      <span className="status-badge on" style={{ padding: 4 }}><Icon name="check" size={12} /></span>
                    ) : (
                      <span className="status-badge warn" style={{ padding: 4 }}><Icon name="spark" size={12} /></span>
                    )}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                      <span style={{ fontWeight: 600, fontSize: 14.5 }}>{log.event}</span>
                      <span className="mono" style={{ fontSize: 11, color: 'var(--ink-3)' }}>{log.ts}</span>
                    </div>
                    <p style={{ color: 'var(--ink-2)', fontSize: 13.5, marginTop: 4 }}>{log.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          <div className="card">
            <div className="card-title">
              <Icon name="shield" size={18} style={{ color: 'var(--accent)' }} />
              <span>Charter Policy Constraints</span>
            </div>
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                ['Strategy Target Assets', p.assets],
                ['Rebalance Trigger Band', 'Drift exceeds 5.0%'],
                ['Whitelisted Venues', p.chain === 'Arbitrum' ? 'GMX V2, Uniswap V3, Aave V3' : 'Robinhood Stock Faucet, Aave V3'],
                ['Supported Tokens', p.chain === 'Arbitrum' ? 'USDC, ETH, GMX, ARB' : 'USDC, TSLA, AMZN, PLTR, NFLX, AMD'],
                ['Max Slippage Limit', '0.5%'],
                ['Escrow Developer Stake', '1,000 USDC'],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', flexDirection: 'column', gap: 4, paddingBottom: 10, borderBottom: '1px solid var(--vellum-soft)' }}>
                  <span className="mono" style={{ fontSize: 10.5, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '.04em' }}>{k}</span>
                  <span style={{ fontWeight: 600, fontSize: 14 }}>{v}</span>
                </div>
              ))}
              
              <div style={{ background: 'var(--paper-raise)', border: '1px solid var(--vellum)', borderRadius: 'var(--r)', padding: 14, marginTop: 6 }}>
                <div style={{ display: 'flex', gap: 8, color: 'var(--accent-deep)' }}>
                  <Icon name="shieldcheck" size={18} style={{ flex: 'none', marginTop: 1 }} />
                  <p style={{ fontSize: 12.5, fontWeight: 500, lineHeight: 1.4 }}>
                    Math-verified execution. The pilot's session keys are physically restricted by smart contract logic to these exact rules.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

### `app/vault/create/page.tsx`
```tsx
"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { PILOTS, Pilot, fmtUsd, fmtPct } from '../../../components/data';
import { Icon, RiskPill } from '../../../components/ui';
import { useDashboardState, CharterSettings } from '../../state';

const pilotTargets: Record<string, { sym: string; name: string; color: string }[]> = {
  'conservative-rwa': [
    { sym: 'aUSDC', name: 'Aave USDC yield', color: '#2C8A5B' },
    { sym: 'TSLA', name: 'Tokenized Tesla', color: '#C0573B' }
  ],
  'aggressive-yield': [
    { sym: 'ETH', name: 'Ethereum spot', color: '#6B57C4' },
    { sym: 'GMX', name: 'GMX perp margin', color: '#B8843C' }
  ],
  'steady-yield': [
    { sym: 'USDC', name: 'USD Coin stable', color: '#2C8A5B' },
    { sym: 'USDT', name: 'Tether stable', color: '#2E6E8E' }
  ],
  'delta-neutral': [
    { sym: 'USDC', name: 'USD Coin stable', color: '#2C8A5B' },
    { sym: 'BTC-H', name: 'Hedged Bitcoin', color: '#1F9DAE' }
  ],
  'index-pilot': [
    { sym: 'USDC', name: 'USD Coin stable', color: '#2C8A5B' },
    { sym: 'RWA-IDX', name: 'Equities Basket', color: '#C0573B' }
  ],
  'tide-runner': [
    { sym: 'USDC', name: 'USDC margin', color: '#2C8A5B' },
    { sym: 'ETH-P', name: 'ETH perps', color: '#1F9DAE' }
  ]
};

function VaultCreateWizardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { walletConnected, connectWallet, deployVault } = useDashboardState();

  const [step, setStep] = useState(1);
  const [chain, setChain] = useState<string>('');
  const [selectedPilotId, setSelectedPilotId] = useState<string>('');
  
  const [splitRatio, setSplitRatio] = useState<number>(60);
  const [maxSingleTx, setMaxSingleTx] = useState<number>(10000);
  const [maxDailySpend, setMaxDailySpend] = useState<number>(30000);
  const [slippage, setSlippage] = useState<number>(0.5);

  const [deploying, setDeploying] = useState(false);
  const [deployStep, setDeployStep] = useState('');

  useEffect(() => {
    const pilotId = searchParams.get('pilot');
    if (pilotId && PILOTS.some(p => p.id === pilotId)) {
      const p = PILOTS.find(p => p.id === pilotId)!;
      setSelectedPilotId(pilotId);
      setChain(p.chain);
      setStep(3);
    }
  }, [searchParams]);

  const chainPilots = PILOTS.filter(p => p.chain === chain);
  const selectedPilot = PILOTS.find(p => p.id === selectedPilotId);

  const handleSelectChain = (c: string) => {
    setChain(c);
    if (selectedPilot && selectedPilot.chain !== c) {
      setSelectedPilotId('');
    }
    setStep(2);
  };

  const handleSelectPilot = (id: string) => {
    setSelectedPilotId(id);
    setStep(3);
  };

  const handleDeploy = () => {
    if (!walletConnected) {
      connectWallet('MetaMask');
      return;
    }

    if (!selectedPilot) return;

    setDeploying(true);
    const logs = [
      'Sponsoring deployment fees via Alchemy Paymaster...',
      'Signing session keys with fine-grained ERC-7715 charter...',
      'Deploying non-custodial smart contract vault...',
      'Vault initialized. Safe sailing!'
    ];

    let runningLogIndex = 0;
    setDeployStep(logs[0]);

    const timer = setInterval(() => {
      runningLogIndex += 1;
      if (runningLogIndex < logs.length) {
        setDeployStep(logs[runningLogIndex]);
      } else {
        clearInterval(timer);
        
        const targets = pilotTargets[selectedPilotId] || [
          { sym: 'USDC', name: 'USD Coin', color: '#2C8A5B' },
          { sym: 'ASSET', name: 'Target asset', color: '#C0573B' }
        ];

        const charter: CharterSettings = {
          targets: [
            { ...targets[0], target: splitRatio },
            { ...targets[1], target: 100 - splitRatio }
          ],
          maxSingleTx,
          maxDailySpend,
          slippage
        };

        deployVault(chain, selectedPilotId, charter);
        router.push('/');
      }
    }, 1200);
  };

  return (
    <div className="wrap" style={{ maxWidth: 640, paddingTop: '10px' }}>
      
      {!deploying && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }} className="mono">
          <span style={{ fontSize: 13, color: step >= 1 ? 'var(--accent-deep)' : 'var(--ink-3)', fontWeight: step === 1 ? 700 : 500 }}>
            01. Network
          </span>
          <div style={{ flex: 1, height: 1.5, background: 'var(--vellum)', margin: '0 10px' }} />
          <span style={{ fontSize: 13, color: step >= 2 ? 'var(--accent-deep)' : 'var(--ink-3)', fontWeight: step === 2 ? 700 : 500 }}>
            02. Pilot
          </span>
          <div style={{ flex: 1, height: 1.5, background: 'var(--vellum)', margin: '0 10px' }} />
          <span style={{ fontSize: 13, color: step >= 3 ? 'var(--accent-deep)' : 'var(--ink-3)', fontWeight: step === 3 ? 700 : 500 }}>
            03. Charter
          </span>
          <div style={{ flex: 1, height: 1.5, background: 'var(--vellum)', margin: '0 10px' }} />
          <span style={{ fontSize: 13, color: step >= 4 ? 'var(--accent-deep)' : 'var(--ink-3)', fontWeight: step === 4 ? 700 : 500 }}>
            04. Sign
          </span>
        </div>
      )}

      {deploying ? (
        <div className="card" style={{ padding: 40, textAlign: 'center' }}>
          <span className="chip live" style={{ marginBottom: 20 }}>
            <span className="pulse" /> Deploying
          </span>
          <h2 className="h2" style={{ fontSize: 24, marginBottom: 12 }}>Setting up your vault</h2>
          <p className="mono" style={{ fontSize: 14, color: 'var(--ink-2)' }}>{deployStep}</p>
          <div style={{ display: 'grid', placeItems: 'center', margin: '30px 0' }}>
            <svg className="compass-bg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="0.8" style={{ animation: 'spin 4s linear infinite', position: 'static', opacity: 1 }}>
              <path d="M12 2v20M2 12h20M12 12l4-7-4 2-4-2 4 7Z" />
            </svg>
            <style jsx global>{`
              @keyframes spin { to { transform: rotate(360deg); } }
            `}</style>
          </div>
        </div>
      ) : (
        <div className="card" style={{ padding: 30 }}>
          
          {step === 1 && (
            <div>
              <h2 className="h2" style={{ marginBottom: 18 }}>Select your navigation waters</h2>
              <p style={{ color: 'var(--ink-2)', fontSize: 15, marginBottom: 24 }}>
                Choose which testnet chain you want to deploy your non-custodial smart vault on.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <button
                  className="wallet-opt"
                  style={{ borderColor: chain === 'Arbitrum' ? 'var(--accent)' : 'var(--vellum)', background: chain === 'Arbitrum' ? 'var(--accent-soft)' : 'var(--paper-raise)', padding: 20 }}
                  onClick={() => handleSelectChain('Arbitrum')}
                >
                  <span className="ic" style={{ background: 'var(--accent-soft)', fontSize: 22 }}>⚓</span>
                  <div>
                    <span style={{ fontWeight: 700, fontSize: 16, display: 'block' }}>Arbitrum Sepolia Testnet</span>
                    <span style={{ fontSize: 13, color: 'var(--ink-3)', fontWeight: 400 }}>High yield DeFi protocols whitelisted (GMX, Aave).</span>
                  </div>
                  <Icon name="arrow" size={16} style={{ marginLeft: 'auto', color: 'var(--ink-3)' }} />
                </button>
                <button
                  className="wallet-opt"
                  style={{ borderColor: chain === 'Robinhood Chain' ? 'var(--accent)' : 'var(--vellum)', background: chain === 'Robinhood Chain' ? 'var(--accent-soft)' : 'var(--paper-raise)', padding: 20 }}
                  onClick={() => handleSelectChain('Robinhood Chain')}
                >
                  <span className="ic" style={{ background: 'var(--accent-soft)', fontSize: 22 }}>📈</span>
                  <div>
                    <span style={{ fontWeight: 700, fontSize: 16, display: 'block' }}>Robinhood Chain Testnet (46630)</span>
                    <span style={{ fontSize: 13, color: 'var(--ink-3)', fontWeight: 400 }}>Tokenized real world stocks whitelisted (TSLA, AMZN, NFLX).</span>
                  </div>
                  <Icon name="arrow" size={16} style={{ marginLeft: 'auto', color: 'var(--ink-3)' }} />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
                <button className="btn btn-ghost btn-sm" onClick={() => setStep(1)} style={{ padding: 6 }}>
                  <Icon name="arrow" size={14} style={{ transform: 'rotate(180deg)' }} />
                </button>
                <h2 className="h2">Select your Pilot</h2>
              </div>
              <p style={{ color: 'var(--ink-2)', fontSize: 15, marginBottom: 24 }}>
                Hire an agent specialized in navigating the whitelisted protocols of <b>{chain}</b>.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {chainPilots.map((p) => {
                  const initials = p.name.replace(/[a-z]/g, '').slice(0, 2);
                  return (
                    <button
                      key={p.id}
                      className="wallet-opt"
                      style={{ padding: '16px 20px', alignItems: 'flex-start' }}
                      onClick={() => handleSelectPilot(p.id)}
                    >
                      <div className="pilot-avatar" style={{ width: 44, height: 44, borderRadius: 10, fontSize: 16, flex: 'none', background: `linear-gradient(150deg, ${p.color}, ${p.color}cc)` }}>
                        {initials}
                      </div>
                      <div style={{ flex: 1, marginLeft: 4 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontWeight: 700, fontSize: 15.5 }}>{p.name}</span>
                          <RiskPill risk={p.risk} />
                        </div>
                        <span style={{ fontSize: 13, color: 'var(--ink-2)', display: 'block', marginTop: 4, fontWeight: 400 }}>
                          {p.blurb}
                        </span>
                        <div className="mono" style={{ fontSize: 11.5, color: 'var(--ink-3)', marginTop: 8, fontWeight: 400 }}>
                          TVL: {fmtUsd(p.tvl)} · APY: {fmtPct(p.apy)} · Score: {p.score}/100
                        </div>
                      </div>
                      <Icon name="arrow" size={16} style={{ marginLeft: 'auto', alignSelf: 'center', color: 'var(--ink-3)' }} />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 3 && selectedPilot && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
                <button className="btn btn-ghost btn-sm" onClick={() => setStep(searchParams.get('pilot') ? 3 : 2)} style={{ padding: 6 }} disabled={!!searchParams.get('pilot')}>
                  <Icon name="arrow" size={14} style={{ transform: 'rotate(180deg)' }} />
                </button>
                <h2 className="h2">Configure Charter Policies</h2>
              </div>
              <p style={{ color: 'var(--ink-2)', fontSize: 15, marginBottom: 24 }}>
                Draw the boundaries for <b>{selectedPilot.name}</b>. The pilot cannot make transactions outside these rules.
              </p>

              <div className="form-group" style={{ background: 'var(--paper-raise)', border: '1px solid var(--vellum)', borderRadius: 'var(--r)', padding: 18, marginBottom: 20 }}>
                {(() => {
                  const targets = pilotTargets[selectedPilotId] || [
                    { sym: 'USDC', name: 'USDC', color: '#2C8A5B' },
                    { sym: 'ASSET', name: 'Asset', color: '#C0573B' }
                  ];
                  return (
                    <>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }} className="mono">
                        <span style={{ fontSize: 12, fontWeight: 600, color: targets[0].color }}>{targets[0].sym} ({splitRatio}%)</span>
                        <span style={{ fontSize: 12, fontWeight: 600, color: targets[1].color }}>{targets[1].sym} ({100 - splitRatio}%)</span>
                      </div>
                      
                      <div style={{ height: 10, borderRadius: 999, display: 'flex', overflow: 'hidden', marginBottom: 16 }}>
                        <div style={{ width: `${splitRatio}%`, background: targets[0].color, transition: 'width 0.2s' }} />
                        <div style={{ width: `${100 - splitRatio}%`, background: targets[1].color, transition: 'width 0.2s' }} />
                      </div>

                      <input
                        type="range"
                        className="form-slider"
                        min="10"
                        max="90"
                        value={splitRatio}
                        onChange={(e) => setSplitRatio(Number(e.target.value))}
                      />
                      <span className="mono" style={{ fontSize: 11, color: 'var(--ink-3)', display: 'block', textAlign: 'center' }}>
                        Drag to adjust the target weights whitelisted for drift rebalancing
                      </span>
                    </>
                  );
                })()}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Max single tx limit</label>
                  <input
                    type="number"
                    className="form-input"
                    value={maxSingleTx}
                    onChange={(e) => setMaxSingleTx(Number(e.target.value))}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Max daily budget</label>
                  <input
                    type="number"
                    className="form-input"
                    value={maxDailySpend}
                    onChange={(e) => setMaxDailySpend(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <label className="form-label">Max Slippage tolerance</label>
                  <span className="mono" style={{ fontSize: 13, fontWeight: 700 }}>{slippage}%</span>
                </div>
                <input
                  type="range"
                  className="form-slider"
                  min="0.1"
                  max="2.0"
                  step="0.1"
                  value={slippage}
                  onChange={(e) => setSlippage(Number(e.target.value))}
                />
              </div>

              <button className="btn btn-primary" style={{ width: '100%', marginTop: 14 }} onClick={() => setStep(4)}>
                Review and Sign <Icon name="arrow" size={16} />
              </button>
            </div>
          )}

          {step === 4 && selectedPilot && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
                <button className="btn btn-ghost btn-sm" onClick={() => setStep(3)} style={{ padding: 6 }}>
                  <Icon name="arrow" size={14} style={{ transform: 'rotate(180deg)' }} />
                </button>
                <h2 className="h2">Sign Charter Agreement</h2>
              </div>
              <p style={{ color: 'var(--ink-2)', fontSize: 15, marginBottom: 20 }}>
                Review the human-readable summary of the smart charter permissions you are delegating.
              </p>

              <div style={{ background: 'var(--paper-raise)', border: '1px solid var(--vellum)', borderRadius: 'var(--r-lg)', padding: 20, marginBottom: 24 }} className="mono">
                <div style={{ borderBottom: '1px solid var(--vellum)', paddingBottom: 12, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Icon name="scroll" size={16} style={{ color: 'var(--accent)' }} />
                  <span style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', color: 'var(--accent-deep)' }}>
                    Charter agreement: {selectedPilot.name}
                  </span>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 12.5, color: 'var(--ink)' }}>
                  <p>
                    <b>1. Scope:</b> Hires {selectedPilot.name} to pilot assets on {chain}.
                  </p>
                  <p>
                    <b>2. Targets:</b> WHitelisted allocations: 
                    {(() => {
                      const targets = pilotTargets[selectedPilotId] || [];
                      return ` ${targets[0]?.sym || 'Asset 1'} (${splitRatio}%) / ${targets[1]?.sym || 'Asset 2'} (${100 - splitRatio}%)`;
                    })()} (drift band 5%).
                  </p>
                  <p>
                    <b>3. Safe pass limits:</b> Max single transaction of ${maxSingleTx.toLocaleString()} USDC; max daily cumulative spend of ${maxDailySpend.toLocaleString()} USDC.
                  </p>
                  <p>
                    <b>4. Execution boundaries:</b> Allowed destinations restricted strictly to whitelisted smart pools. Slippage maximum {slippage}%.
                  </p>
                  <p style={{ color: 'var(--ink-3)', fontSize: 11, fontStyle: 'italic', borderTop: '1px solid var(--vellum)', paddingTop: 10, marginTop: 4 }}>
                    By signing this ERC-7715 session charter, you grant transaction signing authority inside these rules only. Capital custody remains in your vault.
                  </p>
                </div>
              </div>

              <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleDeploy}>
                {walletConnected ? (
                  <><Icon name="key" size={16} /> Sign ERC-7715 &amp; Deploy Vault</>
                ) : (
                  <><Icon name="anchor" size={16} /> Connect Wallet to Sign</>
                )}
              </button>
              
              <p className="mono" style={{ fontSize: 11.5, color: 'var(--ink-3)', marginTop: 14, textAlign: 'center' }}>
                Gas sponsored on deployment · single transaction deployment
              </p>
            </div>
          )}

        </div>
      )}
    </div>
  );
}

export default function VaultCreateWizard() {
  return (
    <Suspense fallback={<div className="wrap" style={{ paddingTop: 40, fontFamily: 'var(--font-mono)' }}>Loading Pilotage Wizard...</div>}>
      <VaultCreateWizardContent />
    </Suspense>
  );
}
```
