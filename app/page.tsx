"use client";

import React, { useState } from 'react';
import { useReveal, Icon } from '../components/ui';
import {
  Nav,
  Hero,
  Ticker,
  Problem,
  Pillars,
  LiveDemo,
  Harbor,
  HowItWorks,
  Ecosystem,
  FinalCTA,
} from '../components/sections';
interface ConnectModalProps {
  onClose: () => void;
  onConnect: () => void;
}

function ConnectModal({ onClose, onConnect }: ConnectModalProps) {
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
          <button className="btn btn-ghost btn-sm" onClick={onClose} style={{ padding: 8 }}><Icon name="x" size={16} /></button>
        </div>
        <p style={{ color: 'var(--ink-2)', fontSize: 14.5, marginBottom: 8 }}>
          Connect a wallet to deploy your vault. Pilotage never takes custody, your keys stay yours.
        </p>
        {wallets.map(([n, e, c]) => (
          <button key={n} className="wallet-opt" onClick={onConnect}>
            <span className="ic" style={{ background: c + '22' }}>{e}</span>
            <span style={{ fontWeight: 600 }}>{n}</span>
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

export default function Home() {
  const [modal, setModal] = useState(false);
  const [connected, setConnected] = useState(false);
  useReveal();

  const onConnect = () => setModal(true);
  const doConnect = () => {
    setConnected(true);
    setModal(false);
  };

  return (
    <>
      <Nav onConnect={onConnect} connected={connected} />
      <Hero onConnect={onConnect} />
      <Ticker />
      <Problem />
      <Pillars />
      <LiveDemo />
      <Harbor onHire={onConnect} />
      <HowItWorks onConnect={onConnect} />
      <Ecosystem />
      <FinalCTA onConnect={onConnect} />

      {modal && <ConnectModal onClose={() => setModal(false)} onConnect={doConnect} />}
    </>
  );
}
