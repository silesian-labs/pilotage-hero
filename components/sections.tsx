"use client";

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Icon, ScoreRing, Sparkline, RiskPill, Wave } from './ui';
import {
  PILOTS,
  DEMO_FEED,
  HOLDINGS,
  ECO,
  TICKER,
  fmtUsd,
  fmtPct,
  Pilot,
  useEnvUrls,
  enrichApiPilot
} from './data';
import { fetchPilots, fetchStats } from '../lib/api';

// ==========================================
// ---------------- NAV ----------------
// ==========================================
interface NavProps {
  onConnect: () => void;
  connected: boolean;
}

export function Nav({ onConnect, connected }: NavProps) {
  const [scrolled, setScrolled] = useState(false);
  const urls = useEnvUrls();
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  const links = [
    ['Harbor', '#harbor'], ['Live demo', '#demo'], ['For builders', '#builders'], ['Standards', '#standards'],
  ];

  return (
    <nav className={'nav' + (scrolled ? ' scrolled' : '')}>
      <div className="wrap nav-inner">
        <BrandAnchor />
        <div className="nav-links">
          {links.map(([t, h]) => <a key={t} className="nav-link" href={h}>{t}</a>)}
        </div>
        <div className="nav-spacer" />
        <div>
          <a className="btn btn-primary btn-sm" href={urls.dashboard}>
            <Icon name="anchor" size={13} style={{ marginRight: 5 }} /> Launch App
          </a>
        </div>
      </div>
    </nav>
  );
}


function BrandAnchor() {
  return (
    <a href="#top" className="brand">
      <span className="brand-mark" style={{ width: 36, height: 36, display: 'grid', placeItems: 'center' }}>
        <Icon name="anchor" size={36 * 0.56} sw={1.9} style={{ color: '#F2E6CE' }} />
      </span>
      <span className="brand-name">Pilotage<span className="dot">.</span></span>
    </a>
  );
}

// ==========================================
// ---------------- HERO ----------------
// ==========================================
interface HeroProps {
  onConnect: () => void;
}

export function Hero({ onConnect }: HeroProps) {
  const urls = useEnvUrls();
  return (
    <header id="top" className="hero">
      <div className="hero-media">
        {/* Looped background video */}
        <video
          src="/timeline.mp4"
          autoPlay
          muted
          loop
          playsInline
        />
      </div>
      <div className="hero-scrim" />

      <div className="wrap hero-overlay">
        <div className="hero-copy">
          <span className="glass-pill reveal" style={{ marginBottom: 22 }}>
            <span className="chip live" style={{ padding: 0, border: 'none', background: 'none' }}>
              <span className="pulse" />
            </span>
            <span className="mono" style={{ fontSize: 12.5, letterSpacing: '.04em' }}>
              Live on Arbitrum &amp; Robinhood Chain testnet
            </span>
          </span>
          <h1 className="h-display reveal d1">
            Where capitan<br />finds its <span style={{ color: 'var(--accent)', position: 'relative', whiteSpace: 'nowrap' }}>
              pilot
              <svg viewBox="0 0 200 14" preserveAspectRatio="none" style={{ position: 'absolute', left: 0, right: 0, bottom: -6, width: '100%', height: 12 }}>
                <path d="M2 9 C 50 2 150 2 198 8" fill="none" stroke="var(--accent)" strokeWidth="3" strokeLinecap="round" opacity=".55" />
              </svg>
            </span>.
          </h1>
          <p className="lead reveal d2" style={{ marginTop: 26, maxWidth: 470 }}>
            The marketplace for autonomous capital management. Deploy a
            non-custodial vault, hand a pilot a narrow charter, and keep the helm,
            zero custody, zero trust assumptions.
          </p>
          <div className="reveal d3" style={{ display: 'flex', gap: 14, marginTop: 32, flexWrap: 'wrap' }}>
            <a className="btn btn-primary btn-lg" href="#harbor">
              <Icon name="compass" size={19} /> Browse the harbor
            </a>
            <a className="btn btn-ghost btn-lg" href={`${urls.dashboard}/vault/create`}>
              <Icon name="anchor" size={18} /> Deploy a vault
            </a>
          </div>
          <p className="mono reveal d3" style={{ fontSize: 12.5, color: 'var(--ink-3)', marginTop: 18 }}>
            No wallet needed to browse · gas sponsored on first charter
          </p>
        </div>
      </div>







    </header>
  );
}

// ==========================================
// ---------------- TICKER ----------------
// ==========================================
export function Ticker() {
  const [stats, setStats] = useState({
    vaults: 0,
    activePilots: 0,
    successfulActions: 0
  });

  useEffect(() => {
    fetchStats().then(data => {
      if (data) {
        setStats(data);
      }
    });
  }, []);

  const dynamicTicker = useMemo(() => {
    return [
      { k: 'Total value piloted', v: '$14.3M' },
      { k: 'Active pilots', v: stats.activePilots > 0 ? stats.activePilots.toString() : '38' },
      { k: 'Captains aboard', v: stats.vaults > 0 ? stats.vaults.toString() : '991' },
      { k: 'Safe passages', v: stats.successfulActions > 0 ? stats.successfulActions.toLocaleString() : '124,807' },
      { k: 'Charter violations blocked', v: '312' },
      { k: 'Avg Pilotage Score', v: '79 / 100' },
    ];
  }, [stats]);

  const row = [...dynamicTicker, ...dynamicTicker];
  return (
    <div className="ticker">
      <div className="ticker-track">
        {row.map((t, i) => (
          <span className="ticker-item" key={i}>
            <Icon name="spark" size={13} style={{ color: 'var(--accent)' }} />
            {t.k} <b>{t.v}</b>
          </span>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// ---------------- PROBLEM ----------------
// ==========================================
export function Problem() {
  const bad = [
    { ic: 'scroll', t: 'Manage it by hand', d: 'Spreadsheets, midnight rebalances, fat-finger risk. Exhausting and error-prone.' },
    { ic: 'lock', t: 'Hand over the keys', d: 'Give custody to a centralized platform and lose the entire point of self-custody.' },
  ];
  return (
    <section className="section">
      <div className="wrap">
        <div className="sec-head center reveal">
          <span className="kicker">The third option</span>
          <h2 className="h1" style={{ marginTop: 18 }}>Holding tokenized assets in 2026<br />means choosing between two bad options.</h2>
          <p className="lead">$50B+ in real-world assets are on-chain. The operational layer to manage them safely doesn't exist yet, so today you either babysit a spreadsheet or surrender your keys.</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'stretch', gap: 20, flexWrap: 'wrap', justifyContent: 'center' }}>
          {bad.map((b, i) => (
            <div key={b.t} className={'card reveal d' + (i + 1)} style={{ flex: '1 1 280px', maxWidth: 360, padding: 26, opacity: .9 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div className="ic" style={{ width: 44, height: 44, borderRadius: 11, display: 'grid', placeItems: 'center', background: 'var(--paper-sink)', color: 'var(--ink-3)' }}>
                  <Icon name={b.ic} size={22} />
                </div>
                <Icon name="x" size={20} style={{ color: 'var(--neg)' }} />
              </div>
              <h3 style={{ fontSize: 20, margin: '16px 0 8px' }}>{b.t}</h3>
              <p style={{ color: 'var(--ink-2)', fontSize: 14.5 }}>{b.d}</p>
            </div>
          ))}

          <div className="reveal d3" style={{ display: 'grid', placeItems: 'center', padding: '0 4px' }}>
            <Icon name="arrow" size={26} style={{ color: 'var(--accent)' }} />
          </div>

          <div className="card reveal d3" style={{ flex: '1 1 300px', maxWidth: 380, padding: 26, borderColor: 'var(--accent-line)', boxShadow: '0 20px 50px -22px var(--accent-glow)', background: 'linear-gradient(180deg,var(--paper-card),var(--paper-raise))' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div className="ic" style={{ width: 44, height: 44, borderRadius: 11, display: 'grid', placeItems: 'center', background: 'var(--accent)', color: 'var(--accent-ink)' }}>
                <Icon name="wheel" size={23} />
              </div>
              <Icon name="check" size={22} style={{ color: 'var(--pos)' }} />
            </div>
            <h3 style={{ fontSize: 20, margin: '16px 0 8px' }}>Pilot it with Pilotage</h3>
            <p style={{ color: 'var(--ink-2)', fontSize: 14.5 }}>Keep your vault, your keys, and the helm. A pilot navigates within a charter you sign, and can never sail outside it.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ==========================================
// ---------------- PILLARS ----------------
// ==========================================
export function Pillars() {
  const items = [
    { ic: 'lock', n: '01', t: 'Non-custodial vaults', d: 'You deploy your own smart-contract vault. Only you hold the keys. One “withdraw all” and funds return to your wallet, Pilotage has zero privileged calls.' },
    { ic: 'key', n: '02', t: 'Permissioned pilots', d: 'Sign an ERC-7715 charter: which contracts, which amounts, how often, what slippage. A pilot physically cannot act outside it, every attempt reverts on-chain.' },
    { ic: 'badge', n: '03', t: 'On-chain Pilotage Score', d: 'Every passage, every rebalance, every off-course is recorded via ERC-8004. Pilots compete on a public track record, not on marketing.' },
  ];
  return (
    <section className="section tight" id="how">
      <div className="wrap">
        <div className="sec-head reveal">
          <span className="kicker">Three joined parts</span>
          <h2 className="h1" style={{ marginTop: 18 }}>Pick your pilot. Set the charter.<br />Keep the helm.</h2>
        </div>
        <div className="pillar-grid">
          {items.map((it, i) => (
            <div key={it.t} className={'card pillar reveal d' + (i + 1)}>
              <span className="num mono">{it.n}</span>
              <div className="ic"><Icon name={it.ic} size={26} /></div>
              <h3>{it.t}</h3>
              <p>{it.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ==========================================
// ---------------- LIVE DEMO ----------------
// ==========================================
export function LiveDemo() {
  const [running, setRunning] = useState(false);
  const [step, setStep] = useState(0);     // 0 = idle/watching … 4 = safe passage
  const [shown, setShown] = useState(1);    // feed items visible
  const timers = useRef<any[]>([]);

  const clearAll = () => { timers.current.forEach(clearTimeout); timers.current = []; };
  useEffect(() => () => clearAll(), []);

  const run = () => {
    if (running) return;
    clearAll();
    setRunning(true);
    setStep(0);
    setShown(1);
    const schedule = [[700, 1], [1700, 2], [2900, 3], [4300, 4]];
    schedule.forEach(([t, s]) => {
      timers.current.push(setTimeout(() => {
        setStep(s);
        setShown(s + 1);
        if (s === 4) setRunning(false);
      }, t));
    });
  };

  const reset = () => { clearAll(); setRunning(false); setStep(0); setShown(1); };

  // derived state
  const drift = step >= 4 ? 0.4 : step >= 3 ? 3.4 : step >= 1 ? 7.6 : 1.2;
  const driftPct = Math.min(100, (drift / 8) * 100);
  const driftColor = drift < 2 ? 'var(--pos)' : drift < 5 ? 'var(--warn)' : 'var(--neg)';
  const tsla = step >= 4 ? 40 : step >= 3 ? 37 : step >= 1 ? 33 : 40;
  const usdc = 100 - tsla;
  const alloc: Record<string, number> = { aUSDC: usdc, TSLA: tsla };
  const score = step >= 4 ? 87.1 : 87.0;
  const statusLabel = step >= 4 ? ['Safe passage', 'var(--pos)']
    : step >= 1 ? ['Off-course, correcting', 'var(--warn)']
      : ['On course', 'var(--pos)'];

  return (
    <>
      <Wave />
      <section className="section deep" id="demo">
        <div className="wrap">
          <div className="sec-head reveal" style={{ maxWidth: 960 }}>
            <span className="kicker">Watch the helm</span>
            <h2 className="h1" style={{ marginTop: 18 }}>The market moves. The pilot acts.<br />You don't lift a finger.</h2>
            <p className="lead">Drop the price of tokenized Tesla and watch a pilot detect the drift, validate against its charter, and navigate back on course, on-chain, in seconds, inside the rails you signed.</p>
          </div>

          <div className="demo-grid">
            {/* LEFT — activity console */}
            <div className="console reveal d1">
              <div className="console-bar">
                <span className="dotrow"><i style={{ background: '#C0573B' }} /><i style={{ background: '#C98A2B' }} /><i style={{ background: '#2C8A5B' }} /></span>
                <span className="console-title">pilot · ConservativeRWA · activity</span>
                <span style={{ marginLeft: 'auto' }} className="chip live"><span className="pulse" /> live</span>
              </div>
              <div className="feed">
                {DEMO_FEED.slice(0, shown).map((f, i) => (
                  <div className="feed-item" key={i} style={{ animationDelay: '0s' }}>
                    <div className="tl">
                      <span className="marker" style={{ background: f.marker }} />
                      {i < shown - 1 && <span className="stem" />}
                    </div>
                    <div className="body">
                      <div className="ttl">{f.ttl}<span className="ts">{f.ts}</span></div>
                      <div className="sub">{f.sub}</div>
                      {f.tx && (
                        <a className="txlink" href="#demo" onClick={(e) => e.preventDefault()}>
                          {f.tx} <Icon name="ext" size={12} />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT — vault state */}
            <div className="console reveal d2" style={{ padding: 0, display: 'flex', flexDirection: 'column' }}>
              <div className="console-bar">
                <Icon name="anchor" size={15} style={{ color: 'var(--accent-bright)' }} />
                <span className="console-title">vault · 0xA4…ce2f</span>
                <span className="ts mono" style={{ marginLeft: 'auto', color: 'var(--deep-ink-3)', fontSize: 11 }}>Robinhood Chain</span>
              </div>

              <div style={{ padding: '20px 20px 6px' }}>
                {/* score + status */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 18 }}>
                  <ScoreRing value={score} size={66} stroke={6} label="" />
                  <div style={{ flex: 1 }}>
                    <div className="mono" style={{ fontSize: 10.5, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--deep-ink-3)' }}>Pilotage Score</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 22, color: 'var(--deep-ink)', transition: '.4s' }}>{score.toFixed(1)}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div className="mono" style={{ fontSize: 10.5, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--deep-ink-3)' }}>Status</div>
                    <div style={{ fontWeight: 600, fontSize: 13.5, color: statusLabel[1], transition: '.3s' }}>{statusLabel[0]}</div>
                  </div>
                </div>

                {/* drift meter */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 7 }}>
                  <span className="mono" style={{ fontSize: 11, color: 'var(--deep-ink-2)' }}>Portfolio drift</span>
                  <span className="mono" style={{ fontSize: 13, fontWeight: 700, color: driftColor, transition: '.4s' }}>{drift.toFixed(1)}%</span>
                </div>
                <div className="drift-meter">
                  <div className="drift-fill" style={{ width: driftPct + '%', background: driftColor }} />
                </div>
                <div className="mono" style={{ fontSize: 10.5, color: 'var(--deep-ink-3)', marginTop: 6 }}>charter band · rebalance above 5.0%</div>
              </div>

              {/* holdings */}
              <div style={{ padding: '14px 20px 18px' }}>
                {HOLDINGS.map((h) => (
                  <div className="holding-row" key={h.sym}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ width: 9, height: 9, borderRadius: 3, background: h.color }} />
                        <span style={{ fontWeight: 600, fontSize: 14, color: 'var(--deep-ink)' }}>{h.sym}</span>
                        <span className="mono" style={{ fontSize: 11, color: 'var(--deep-ink-3)' }}>{h.name}</span>
                      </div>
                      <div className="bar"><i style={{ width: alloc[h.sym] + '%', background: h.color }} /></div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div className="mono" style={{ fontWeight: 700, fontSize: 15, color: 'var(--deep-ink)', transition: '.4s' }}>{alloc[h.sym]}%</div>
                      <div className="mono" style={{ fontSize: 10.5, color: Math.abs(alloc[h.sym] - h.target) > 1 ? 'var(--warn)' : 'var(--deep-ink-3)', transition: '.3s' }}>target {h.target}%</div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 'auto', padding: '0 20px 20px', display: 'flex', gap: 10 }}>
                <button className="btn btn-primary" style={{ flex: 1 }} onClick={run} disabled={running}>
                  {running ? <><Icon name="route" size={16} /> Navigating…</> : <><Icon name="bolt" size={16} /> Drop TSLA −8%</>}
                </button>
                <button className="btn btn-ghost" onClick={reset} title="Reset demo">
                  <Icon name="compass" size={16} />
                </button>
              </div>
            </div>
          </div>

          <p className="mono reveal" style={{ textAlign: 'center', marginTop: 28, fontSize: 12.5, color: 'var(--deep-ink-3)' }}>
            ~20 seconds · no human in the loop · pilot stayed within charter · verifiable on-chain
          </p>
        </div>
      </section>
      <Wave up />
    </>
  );
}

// ==========================================
// ---------------- PILOT CARD --------------
// ==========================================
interface PilotCardProps {
  p: Pilot;
  onHire: (p: Pilot) => void;
}

export function PilotCard({ p }: { p: Pilot }) {
  const initials = p.name.replace(/[a-z]/g, '').slice(0, 2);
  const urls = useEnvUrls();
  const dashboardUrl = urls.dashboard;
  return (
    <div className="card pilot-card" onClick={() => {
      if (typeof window !== 'undefined') {
        window.location.href = `${dashboardUrl}/pilot/${p.id}`;
      }
    }} style={{ cursor: 'pointer' }}>
      <div className="pilot-head">
        <div className="pilot-avatar" style={{ background: `linear-gradient(150deg, ${p.color}, ${p.color}cc)` }}>{initials}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="pilot-name">{p.name}</div>
          <div className="pilot-handle">{p.handle}</div>
        </div>
        <ScoreRing value={p.score} size={56} stroke={6} label="" />
      </div>

      <p style={{ color: 'var(--ink-2)', fontSize: 13.5, lineHeight: 1.5, minHeight: 40 }}>{p.blurb}</p>

      <div style={{ margin: '-2px -2px 0' }}>
        <Sparkline data={p.spark} h={46} color={p.color} sw={2} />
      </div>

      <div className="pilot-stats">
        <div className="pstat"><div className="k">TVL</div><div className="v">{fmtUsd(p.tvl)}</div></div>
        <div className="pstat"><div className="k">Net APY</div><div className="v pos">{fmtPct(p.apy)}</div></div>
        <div className="pstat"><div className="k">Captains</div><div className="v">{p.captains}</div></div>
      </div>

      <div className="tags">
        <RiskPill risk={p.risk} />
        <span className="chip"><Icon name={p.chain === 'Arbitrum' ? 'layers' : 'stock'} size={12} />{p.chain}</span>
      </div>

      <div className="pilot-foot">
        <div className="tags">
          {p.tagset.slice(0, 2).map((t) => <span key={t} className="chip" style={{ fontSize: 10.5, padding: '4px 9px' }}>{t}</span>)}
        </div>
        <a className="btn btn-ghost btn-sm" href={`${dashboardUrl}/vault/create?pilot=${p.id}`} onClick={(e) => { e.stopPropagation(); }}>
          Hire <Icon name="arrow" size={15} />
        </a>
      </div>
    </div>
  );
}



// ==========================================
// ---------------- HARBOR ----------------
// ==========================================
interface HarborProps {
  onHire?: (p: Pilot) => void;
}

export function Harbor({ onHire }: HarborProps) {
  const [pilots, setPilots] = useState<Pilot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPilots().then(data => {
      if (data && data.length > 0) {
        setPilots(data.map(enrichApiPilot));
      } else {
        setPilots(PILOTS);
      }
      setLoading(false);
    });
  }, []);

  const [risk, setRisk] = useState('all');
  const [chain, setChain] = useState('all');
  const [sort, setSort] = useState<'score' | 'tvl' | 'apy' | 'captains'>('score');

  const riskOpts = [['all', 'All'], ['low', 'Calm'], ['balanced', 'Balanced'], ['high', 'High seas']];
  const chainOpts = [['all', 'All chains'], ['Arbitrum', 'Arbitrum'], ['Robinhood Chain', 'Robinhood']];

  const list = useMemo(() => {
    const l = pilots.filter((p) => (risk === 'all' || p.risk === risk) && (chain === 'all' || p.chain === chain));
    const by: Record<string, (a: Pilot, b: Pilot) => number> = {
      score: (a, b) => b.score - a.score,
      tvl: (a, b) => b.tvl - a.tvl,
      apy: (a, b) => b.apy - a.apy,
      captains: (a, b) => b.captains - a.captains
    };
    return [...l].sort(by[sort]);
  }, [pilots, risk, chain, sort]);

  return (
    <section className="section" id="harbor">
      <div className="wrap">
        <div className="sec-head reveal" style={{ marginBottom: 32, maxWidth: 960 }}>
          <span className="kicker">The harbor</span>
          <h2 className="h1" style={{ marginTop: 18 }}>Browse pilots ranked by reputation,<br />not by marketing budget.</h2>
          <p className="lead">Filter by risk, chain, and asset class. Every number here is computed from on-chain history, no wallet required to look around.</p>
        </div>

        <div className="harbor-toolbar reveal">
          <div className="seg">
            {riskOpts.map(([v, l]) => (
              <button key={v} className={risk === v ? 'on' : ''} onClick={() => setRisk(v)}>{l}</button>
            ))}
          </div>
          <div className="seg">
            {chainOpts.map(([v, l]) => (
              <button key={v} className={chain === v ? 'on' : ''} onClick={() => setChain(v)}>{l}</button>
            ))}
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className="mono" style={{ fontSize: 12, color: 'var(--ink-3)' }}>{list.length} pilots</span>
            <select className="sort-select" value={sort} onChange={(e) => setSort(e.target.value as any)}>
              <option value="score">Sort · Pilotage Score</option>
              <option value="tvl">Sort · TVL</option>
              <option value="apy">Sort · Net APY</option>
              <option value="captains">Sort · Captains</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="card" style={{ padding: 40, textAlign: 'center', color: 'var(--ink-3)' }}>
            <Icon name="compass" size={28} className="spin" style={{ color: 'var(--ink-3)' }} />
            <p style={{ marginTop: 10 }}>Searching the harbor for pilots...</p>
          </div>
        ) : (
          <>
            <div className="pilot-grid">
              {list.map((p) => <PilotCard key={p.id} p={p} />)}
            </div>
            {list.length === 0 && (
              <div className="card" style={{ padding: 40, textAlign: 'center', color: 'var(--ink-3)' }}>
                <Icon name="compass" size={28} style={{ color: 'var(--ink-3)' }} />
                <p style={{ marginTop: 10 }}>No pilots match these waters. Widen your filters.</p>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

// ==========================================
// ---------------- HOW IT WORKS -------------
// ==========================================
interface HowItWorksProps {
  onConnect: () => void;
}

export function HowItWorks({ onConnect }: HowItWorksProps) {
  const urls = useEnvUrls();
  const steps = [
    { ic: 'compass', n: 'Step 01', t: 'Browse the harbor', d: 'Compare pilots by Pilotage Score, track record, drawdown, and compliance. Pick one that fits your waters.' },
    { ic: 'scroll', n: 'Step 02', t: 'Sign one charter', d: 'Set asset weights, venues, slippage and daily limits. One ERC-7715 signature, gas sponsored, no ETH required.' },
    { ic: 'coins', n: 'Step 03', t: 'Fund the vault', d: 'Deposit USDC or RWA into a vault only you can open. The pilot wakes the moment funds arrive.' },
    { ic: 'wheel', n: 'Step 04', t: 'Keep the helm', d: 'Watch passages in real time. Revoke the pilot or withdraw everything in a single transaction, anytime.' },
  ];
  return (
    <section className="section tight">
      <div className="wrap">
        <div className="sec-head reveal" style={{ maxWidth: 960 }}>
          <span className="kicker">For captains</span>
          <h2 className="h1" style={{ marginTop: 18 }}>From browsing to safe passage<br />in four steps.</h2>
        </div>
        <div className="steps">
          {steps.map((s, i) => (
            <div key={s.t} className={'card step reveal d' + (i + 1)}>
              <Icon name={s.ic} size={26} className="ic" />
              <div className="sn">{s.n}</div>
              <h3>{s.t}</h3>
              <p>{s.d}</p>
            </div>
          ))}
        </div>
        <div className="reveal" style={{ marginTop: 32 }}>
          <a className="btn btn-primary btn-lg" href={`${urls.dashboard}/vault/create`}>
            <Icon name="anchor" size={18} /> Deploy your vault
          </a>
        </div>
      </div>
    </section>
  );
}



// ==========================================
// ---------------- ECOSYSTEM --------------
// ==========================================
export function Ecosystem() {
  return (
    <section className="section tight deep" id="standards" style={{ paddingTop: 80 }}>
      <div className="wrap">
        <div className="sec-head reveal" style={{ maxWidth: 960 }}>
          <span className="kicker">Ecosystem fit</span>
          <h2 className="h1" style={{ marginTop: 18 }}>Built native on every standard<br />Arbitrum shipped this year.</h2>
        </div>
        <div className="eco-grid">
          {ECO.map((e, i) => (
            <div key={e.t} className={'eco reveal d' + ((i % 3) + 1)}>
              <div className="ic"><Icon name={e.ic} size={22} /></div>
              <div>
                <div className="t">{e.t}</div>
                <div className="d">{e.d}</div>
              </div>
              <Icon name="check" size={18} style={{ color: 'var(--pos)', marginLeft: 'auto' }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ==========================================
// ---------------- FINAL CTA --------------
// ==========================================
interface FinalCTAProps {
  onConnect: () => void;
}

export function FinalCTA({ onConnect }: FinalCTAProps) {
  const urls = useEnvUrls();
  return (
    <section className="section deep final">
      <svg className="compass-bg" width="460" height="460" viewBox="0 0 24 24" fill="none" stroke="var(--accent-bright)" strokeWidth="0.4">
        <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="7" />
        <path d="M12 2v20M2 12h20M12 12l4-7-4 2-4-2 4 7Z" />
      </svg>
      <div className="wrap" style={{ textAlign: 'center', position: 'relative' }}>
        <div className="reveal">
          <span className="kicker" style={{ justifyContent: 'center', display: 'inline-flex' }}>Where capital finds its pilot</span>
          <h2 className="h-display" style={{ margin: '20px auto 0', maxWidth: 960, color: 'var(--deep-ink)' }}>
            Pick your pilot.<br />Keep the helm.
          </h2>
          <p className="lead" style={{ margin: '22px auto 0', maxWidth: 540 }}>
            Browse the harbor anonymously, or deploy a non-custodial vault in one signature. The pilot works 24/7, and can never sail outside your charter.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', marginTop: 34, flexWrap: 'wrap' }}>
            <a className="btn btn-primary btn-lg" href="#harbor"><Icon name="compass" size={19} /> Browse the harbor</a>
            <a className="btn btn-ghost btn-lg" href={`${urls.dashboard}/vault/create`}><Icon name="anchor" size={18} /> Deploy a vault</a>
          </div>
        </div>
      </div>
    </section>
  );
}
