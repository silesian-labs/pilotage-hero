"use client";

import { useReveal, } from '../components/ui';
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

export default function Home() {
  useReveal();

  return (
    <>
      <Nav />
      <Hero />
      <Ticker />
      <Problem />
      <Pillars />
      <LiveDemo />
      <Harbor />
      <HowItWorks />
      <Ecosystem />
      <FinalCTA />
    </>
  );
}
