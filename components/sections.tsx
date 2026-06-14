"use client";

import { useState, useEffect, useMemo, useRef } from 'react';
import { Icon, ScoreRing, Sparkline, RiskPill, Wave } from './ui';
import {
  DEMO_FEED,
  HOLDINGS,
  ECO,
  fmtUsd,
  Pilot,
  useEnvUrls,
  enrichApiPilot,
  pilotColor,
  initialsOf,
  toUiRisk,
} from './data';
import { fetchPilots, fetchStats } from '../lib/api';

export function Nav() {
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


export function Hero() {
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
              Live on Arbitrum Sepolia testnet
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
            No wallet needed to browse · non-custodial · charter-bounded
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

  // Live values come from the indexer; the rest are fixed facts about the stack.
  const dynamicTicker = useMemo(() => {
    return [
      { k: 'Active pilots', v: stats.activePilots.toString() },
      { k: 'Vaults deployed', v: stats.vaults.toString() },
      { k: 'Safe passages', v: stats.successfulActions.toLocaleString() },
      { k: 'Network', v: 'Arbitrum Sepolia' },
      { k: 'Reputation', v: 'ERC-8004' },
      { k: 'Yield venue', v: 'Aave V3' },
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
    { ic: 'key', n: '02', t: 'Permissioned pilots', d: 'Sign an on-chain charter: which contracts, which tokens, the per-action and daily spend caps, the expiry. The vault enforces it — every out-of-bounds attempt reverts.' },
    { ic: 'badge', n: '03', t: 'On-chain Pilotage Score', d: 'Every successful, charter-bounded execution posts +1 via ERC-8004. Pilots compete on a public, verifiable track record, not on marketing.' },
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

  // derived state — aUSDC marked up → overweight → pilot withdraws back to ~50/50
  const drift = step >= 4 ? 0.4 : step >= 3 ? 3.4 : step >= 1 ? 8.0 : 0.0;
  const driftPct = Math.min(100, (drift / 8) * 100);
  const driftColor = drift < 2 ? 'var(--pos)' : drift < 5 ? 'var(--warn)' : 'var(--neg)';
  const aUsdc = step >= 4 ? 50 : step >= 3 ? 54 : step >= 1 ? 58 : 50;
  const usdc = 100 - aUsdc;
  const alloc: Record<string, number> = { USDC: usdc, aUSDC: aUsdc };
  // ERC-8004 score increments by exactly +1 on a successful execution (real behavior).
  const score = step >= 4 ? 6 : 5;
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
            <p className="lead">Mark aUSDC up and watch the pilot detect the drift, ask its AI decision engine how far to correct, validate against the charter, and rebalance USDC/aUSDC on Aave — on-chain, in seconds, inside the rails you signed.</p>
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
                <span className="console-title">vault · 0x5A6C…3bfe</span>
                <span className="ts mono" style={{ marginLeft: 'auto', color: 'var(--deep-ink-3)', fontSize: 11 }}>Arbitrum Sepolia</span>
              </div>

              <div style={{ padding: '20px 20px 6px' }}>
                {/* score + status */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 18 }}>
                  <div style={{ flex: 1 }}>
                    <div className="mono" style={{ fontSize: 10.5, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--deep-ink-3)' }}>ERC-8004 Score</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 22, color: 'var(--deep-ink)', transition: '.4s' }}>
                      {score}{step >= 4 && <span style={{ color: 'var(--pos)', fontSize: 13 }}> +1</span>}
                    </div>
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
                  {running ? <><Icon name="route" size={16} /> Navigating…</> : <><Icon name="bolt" size={16} /> Mark aUSDC +40%</>}
                </button>
                <button className="btn btn-ghost" onClick={reset} title="Reset demo">
                  <Icon name="compass" size={16} />
                </button>
              </div>
            </div>
          </div>

          <p className="mono reveal" style={{ textAlign: 'center', marginTop: 28, fontSize: 12.5, color: 'var(--deep-ink-3)' }}>
            Illustration of the real flow · AI-sized · pilot stayed within charter · verifiable on-chain
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
  const urls = useEnvUrls();
  const dashboardUrl = urls.dashboard;
  return (
    <div className="card pilot-card" onClick={() => {
      if (typeof window !== 'undefined') {
        window.location.href = `${dashboardUrl}/pilot/${p.id}`;
      }
    }} style={{ cursor: 'pointer' }}>
      <div className="pilot-head">
        <div className="pilot-avatar" style={{ background: `linear-gradient(150deg, ${p.color}, ${p.color}cc)` }}>{initialsOf(p.name)}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="pilot-name">{p.name}</div>
          <div className="pilot-handle mono">{p.handle}</div>
        </div>
        <ScoreRing value={Math.min(100, Math.max(0, p.score))} size={56} stroke={6} label="" />
      </div>

      <p style={{ color: 'var(--ink-2)', fontSize: 13.5, lineHeight: 1.5, minHeight: 40 }}>{p.description}</p>

      <div style={{ margin: '-2px -2px 0' }}>
        <Sparkline data={p.spark} h={46} color={p.color} sw={2} />
      </div>

      <div className="pilot-stats">
        <div className="pstat"><div className="k">Score</div><div className="v">{p.score}</div></div>
        <div className="pstat"><div className="k">Stake</div><div className="v">{fmtUsd(p.stakeUsd)}</div></div>
        <div className="pstat"><div className="k">Tokens</div><div className="v">USDC·aUSDC</div></div>
      </div>

      <div className="pilot-foot">
        <div className="tags">
          <RiskPill risk={p.risk} />
          <span className="chip"><Icon name="layers" size={12} /> Arbitrum Sepolia</span>
        </div>
        <a className="btn btn-ghost btn-sm" href={`${dashboardUrl}/vault/create?pilot=${p.id}`} onClick={(e) => { e.stopPropagation(); }}>
          Hire <Icon name="arrow" size={15} />
        </a>
      </div>
    </div>
  );
}




export function Harbor() {
  const [pilots, setPilots] = useState<Pilot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPilots().then(data => {
      setPilots(data.map(enrichApiPilot));
      setLoading(false);
    });
  }, []);

  const [risk, setRisk] = useState('all');
  const [sort, setSort] = useState<'score' | 'stake'>('score');

  const riskOpts = [['all', 'All'], ['low', 'Calm'], ['balanced', 'Balanced'], ['high', 'High seas']];

  const list = useMemo(() => {
    const l = pilots.filter((p) => (risk === 'all' || p.risk === risk));
    const by: Record<string, (a: Pilot, b: Pilot) => number> = {
      score: (a, b) => b.score - a.score,
      stake: (a, b) => b.stakeUsd - a.stakeUsd,
    };
    return [...l].sort(by[sort]);
  }, [pilots, risk, sort]);

  return (
    <section className="section" id="harbor">
      <div className="wrap">
        <div className="sec-head reveal" style={{ marginBottom: 32, maxWidth: 960 }}>
          <span className="kicker">The harbor</span>
          <h2 className="h1" style={{ marginTop: 18 }}>Browse pilots ranked by reputation,<br />not by marketing budget.</h2>
          <p className="lead">Every pilot is registered on-chain with a staked bond, and ranked by an ERC-8004 score earned one safe passage at a time. No wallet required to look around.</p>
        </div>

        <div className="harbor-toolbar reveal">
          <div className="seg">
            {riskOpts.map(([v, l]) => (
              <button key={v} className={risk === v ? 'on' : ''} onClick={() => setRisk(v)}>{l}</button>
            ))}
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className="mono" style={{ fontSize: 12, color: 'var(--ink-3)' }}>{list.length} pilot{list.length === 1 ? '' : 's'}</span>
            <select className="sort-select" value={sort} onChange={(e) => setSort(e.target.value as any)}>
              <option value="score">Sort · Pilotage Score</option>
              <option value="stake">Sort · Stake</option>
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


export function HowItWorks() {
  const urls = useEnvUrls();
  const steps = [
    { ic: 'compass', n: 'Step 01', t: 'Browse the harbor', d: 'Compare pilots by their ERC-8004 Pilotage Score, safe-passage count, and staked bond. Pick one that fits your waters.' },
    { ic: 'scroll', n: 'Step 02', t: 'Sign one charter', d: 'Set the whitelisted venue and tokens, the per-action and daily spend caps, and an expiry. The vault enforces every limit on-chain.' },
    { ic: 'coins', n: 'Step 03', t: 'Fund the vault', d: 'Deposit USDC into a vault only you can open. The pilot wakes the moment funds arrive.' },
    { ic: 'wheel', n: 'Step 04', t: 'Keep the helm', d: 'Watch passages in real time. Pause, revoke the pilot, or force-withdraw everything in a single transaction, anytime.' },
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


export function FinalCTA() {
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
