'use client';

import React from 'react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="bg-[#131312] text-[#e5e2df] antialiased min-h-screen flex flex-col selection:bg-[#c7f16a]/30 selection:text-[#c7f16a]">
      {/* ========================================================================= */}
      {/* FIXED TOP NAVIGATION BAR */}
      {/* ========================================================================= */}
      <header className="fixed top-0 w-full z-50 bg-[#131312]/90 backdrop-blur-md border-b border-[#2a2a29]">
        <div className="h-[72px] max-w-[1440px] mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Logo & Version */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#c7f16a] flex items-center justify-center font-black text-[#141f00] text-base shadow-[0_0_20px_rgba(199,241,106,0.35)]">
                ▲
              </div>
              <span className="font-sans text-lg tracking-tight font-bold text-[#e5e2df]">
                Portfolio.ai
              </span>
            </Link>
            <span className="font-mono text-[11px] text-[#8e937f] px-2 py-0.5 border border-[#444938] rounded uppercase tracking-wider">
              v1.0.4
            </span>
          </div>

          {/* Centered Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#explore"
              className="font-mono text-xs tracking-widest text-[#c4c9b3] hover:text-[#c7f16a] transition-colors uppercase"
            >
              EXPLORE
            </a>
            <a
              href="#showcase"
              className="font-mono text-xs tracking-widest text-[#c4c9b3] hover:text-[#c7f16a] transition-colors uppercase"
            >
              SHOWCASE
            </a>
            <a
              href="#architecture"
              className="font-mono text-xs tracking-widest text-[#c4c9b3] hover:text-[#c7f16a] transition-colors uppercase"
            >
              ARCHITECTURE
            </a>
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-4">
            <Link
              href="/auth/login"
              className="font-mono text-xs tracking-wider uppercase px-4 py-2 border border-[#444938] hover:border-[#8e937f] text-[#e5e2df] transition-all rounded"
            >
              Sign In
            </Link>
            <Link
              href="/onboarding"
              className="font-mono text-xs font-bold tracking-wider uppercase bg-[#c7f16a] hover:bg-[#abd551] text-[#141f00] px-5 py-2.5 rounded transition-all shadow-[0_0_25px_rgba(199,241,106,0.35)] flex items-center gap-1.5 group"
            >
              <span>Generate Portfolio</span>
              <span className="material-symbols-outlined text-[16px] transition-transform duration-200 group-hover:translate-x-1">
                arrow_forward
              </span>
            </Link>
            <div className="hidden sm:flex w-8 h-8 rounded-full bg-[#2a2a29] border border-[#444938] items-center justify-center">
              <span className="material-symbols-outlined text-[#c4c9b3] text-[18px]">
                person
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* MAIN HERO & CONTENT */}
      {/* ========================================================================= */}
      <main className="w-full pt-[72px] bg-[#131312] flex-1">
        {/* HERO SECTION */}
        <section className="w-full min-h-[860px] flex flex-col items-center justify-center pt-16 pb-20 relative overflow-hidden">
          {/* Radial Ambient Glow */}
          <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center opacity-30">
            <div className="w-[850px] h-[850px] rounded-full bg-[#c7f16a]/15 blur-[140px]" />
          </div>

          <div className="max-w-[1080px] mx-auto px-6 md:px-12 relative z-10 flex flex-col items-center text-center">
            {/* Engine Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#1c1c1a] rounded-full mb-8 shadow-sm border border-[#353533]">
              <span className="material-symbols-outlined text-[15px] text-[#c7f16a]">
                auto_awesome
              </span>
              <span className="font-mono text-xs text-[#c4c9b3] uppercase tracking-widest font-medium">
                NEXT-GENERATION AI IDENTITY ENGINE
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="flex flex-col items-center gap-2 mb-6">
              <span className="font-sans font-black tracking-tight text-[#e5e2df] uppercase text-3xl sm:text-5xl md:text-6xl lg:text-[66px] leading-[1.05] max-w-4xl mx-auto">
                TURN YOUR PROFESSIONAL IDENTITY INTO A
              </span>
              <span className="font-serif italic font-normal text-[#c7f16a] text-5xl sm:text-7xl md:text-8xl lg:text-[104px] leading-[0.95] block mt-3 drop-shadow-[0_0_35px_rgba(199,241,106,0.2)]">
                Bespoke digital identity.
              </span>
            </h1>

            {/* Sub-headline */}
            <p className="font-sans text-[#c4c9b3] text-base sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
              Upload your resume, express your intent, and let AI understand your career to create a portfolio designed specifically around who you are.
            </p>

            {/* Call To Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
              <Link
                href="/onboarding"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#c7f16a] hover:bg-[#abd551] text-[#141f00] font-bold text-base transition-all duration-200 shadow-[0_0_30px_rgba(199,241,106,0.35)] flex items-center justify-center gap-2 group"
              >
                <span>Generate My Portfolio</span>
                <span className="material-symbols-outlined text-[20px] transition-transform duration-200 group-hover:translate-x-1">
                  arrow_forward
                </span>
              </Link>
              <a
                href="#explore"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#1c1c1a] hover:bg-[#20201e] text-[#e5e2df] hover:text-white font-medium text-base transition-all duration-200 border border-[#353533] hover:border-[#8e937f] flex items-center justify-center gap-2 shadow-sm"
              >
                <span>Explore Features</span>
                <span className="material-symbols-outlined text-[18px] text-[#8e937f]">
                  south
                </span>
              </a>
            </div>

            {/* Tech Specs Meta */}
            <div className="mt-16 flex flex-wrap items-center justify-center gap-6 sm:gap-8 opacity-80 border-t border-[#2a2a29] pt-8 w-full max-w-3xl">
              <div className="flex flex-col items-center gap-1">
                <span className="font-mono text-[10px] text-[#8e937f] uppercase tracking-widest">
                  ENGINE
                </span>
                <span className="font-mono text-xs text-[#e5e2df] font-semibold">
                  GPT-4o + CLAUDE 3.5
                </span>
              </div>
              <div className="w-1 h-1 bg-[#444938] rounded-full hidden sm:block" />
              <div className="flex flex-col items-center gap-1">
                <span className="font-mono text-[10px] text-[#8e937f] uppercase tracking-widest">
                  RENDERING
                </span>
                <span className="font-mono text-xs text-[#e5e2df] font-semibold">
                  REACT + TAILWIND
                </span>
              </div>
              <div className="w-1 h-1 bg-[#444938] rounded-full hidden sm:block" />
              <div className="flex flex-col items-center gap-1">
                <span className="font-mono text-[10px] text-[#8e937f] uppercase tracking-widest">
                  DEPLOYMENT
                </span>
                <span className="font-mono text-xs text-[#e5e2df] font-semibold">
                  EDGE NETWORK
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* FEATURES GRID SECTION */}
        {/* ========================================================================= */}
        <section id="explore" className="w-full max-w-[1440px] mx-auto px-6 md:px-12 py-24 border-t border-[#2a2a29]">
          <div className="flex flex-col items-center text-center mb-16">
            <span className="font-mono text-xs text-[#c7f16a] uppercase tracking-widest font-semibold mb-2">
              CORE ENGINE MODULES
            </span>
            <h2 className="font-sans text-3xl sm:text-4xl font-bold tracking-tight text-[#e5e2df]">
              Surgical precision at every layer.
            </h2>
            <p className="font-sans text-[#c4c9b3] text-sm sm:text-base max-w-xl mt-3">
              A 5-stage deterministic AI synthesis pipeline that turns unstructured career milestones into production web applications.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Module 01 */}
            <div className="bg-[#1c1c1a] p-8 rounded-xl border border-[#2a2a29] shadow-md hover:-translate-y-1.5 transition-all duration-300 relative overflow-hidden group hover:border-[#444938]">
              <div className="w-12 h-12 bg-[#131312] flex items-center justify-center rounded-lg border border-[#353533] mb-6 relative z-10 shadow-sm">
                <span className="material-symbols-outlined text-[#c7f16a] text-[22px]">
                  troubleshoot
                </span>
              </div>
              <h3 className="font-sans text-xl font-bold mb-3 text-[#e5e2df]">
                Resume Intelligence
              </h3>
              <p className="font-sans text-[#c4c9b3] text-sm leading-relaxed">
                Grounded fact extraction without hallucination. Builds an immutable semantic graph of your skills, achievements, and impact.
              </p>
              <div className="mt-8 pt-4 border-t border-[#2a2a29] flex justify-between items-center">
                <span className="font-mono text-xs text-[#8e937f]">SYS_MOD_01</span>
                <div className="w-2 h-2 rounded-full bg-[#c7f16a] animate-pulse" />
              </div>
            </div>

            {/* Module 02 */}
            <div className="bg-[#1c1c1a] p-8 rounded-xl border border-[#2a2a29] shadow-md hover:-translate-y-1.5 transition-all duration-300 relative overflow-hidden group hover:border-[#444938]">
              <div className="w-12 h-12 bg-[#131312] flex items-center justify-center rounded-lg border border-[#353533] mb-6 relative z-10 shadow-sm">
                <span className="material-symbols-outlined text-[#f0bf64] text-[22px]">
                  palette
                </span>
              </div>
              <h3 className="font-sans text-xl font-bold mb-3 text-[#e5e2df]">
                Design DNA
              </h3>
              <p className="font-sans text-[#c4c9b3] text-sm leading-relaxed">
                Algorithmic translation of career energy into typography, calibrated color theory, component hierarchy, and custom tokens.
              </p>
              <div className="mt-8 pt-4 border-t border-[#2a2a29] flex justify-between items-center">
                <span className="font-mono text-xs text-[#8e937f]">SYS_MOD_02</span>
                <div className="w-2 h-2 rounded-full bg-[#f0bf64] animate-pulse" />
              </div>
            </div>

            {/* Module 03 */}
            <div className="bg-[#1c1c1a] p-8 rounded-xl border border-[#2a2a29] shadow-md hover:-translate-y-1.5 transition-all duration-300 relative overflow-hidden group hover:border-[#444938]">
              <div className="w-12 h-12 bg-[#131312] flex items-center justify-center rounded-lg border border-[#353533] mb-6 relative z-10 shadow-sm">
                <span className="material-symbols-outlined text-[#c7f16a] text-[22px]">
                  chat
                </span>
              </div>
              <h3 className="font-sans text-xl font-bold mb-3 text-[#e5e2df]">
                AI Natural Editor
              </h3>
              <p className="font-sans text-[#c4c9b3] text-sm leading-relaxed">
                Refine copy, reorder sections, or modify design DNA via natural language commands that compile to precise AST patches.
              </p>
              <div className="mt-8 pt-4 border-t border-[#2a2a29] flex justify-between items-center">
                <span className="font-mono text-xs text-[#8e937f]">SYS_MOD_03</span>
                <div className="w-2 h-2 rounded-full bg-[#c7f16a] animate-pulse" />
              </div>
            </div>

            {/* Module 04 */}
            <div className="bg-[#1c1c1a] p-8 rounded-xl border border-[#2a2a29] shadow-md hover:-translate-y-1.5 transition-all duration-300 relative overflow-hidden group hover:border-[#444938]">
              <div className="w-12 h-12 bg-[#131312] flex items-center justify-center rounded-lg border border-[#353533] mb-6 relative z-10 shadow-sm">
                <span className="material-symbols-outlined text-[#abd551] text-[22px]">
                  verified
                </span>
              </div>
              <h3 className="font-sans text-xl font-bold mb-3 text-[#e5e2df]">
                Automated QA
              </h3>
              <p className="font-sans text-[#c4c9b3] text-sm leading-relaxed">
                Autonomous audits for WCAG AA accessibility, mobile responsive layouts, contrast safety, and sub-second Lighthouse scores.
              </p>
              <div className="mt-8 pt-4 border-t border-[#2a2a29] flex justify-between items-center">
                <span className="font-mono text-xs text-[#8e937f]">SYS_MOD_04</span>
                <div className="w-2 h-2 rounded-full bg-[#abd551] animate-pulse" />
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SHOWCASE / BESPOKE ARCHETYPES */}
        {/* ========================================================================= */}
        <section id="showcase" className="w-full max-w-[1440px] mx-auto px-6 md:px-12 py-24 border-t border-[#2a2a29]">
          <div className="flex flex-col items-center text-center mb-16">
            <span className="font-mono text-xs text-[#f0bf64] uppercase tracking-widest font-semibold mb-2">
              BESPOKE SHOWCASE
            </span>
            <h2 className="font-sans text-3xl sm:text-4xl font-bold tracking-tight text-[#e5e2df]">
              Never generic. Tailored to your archetype.
            </h2>
            <p className="font-sans text-[#c4c9b3] text-sm sm:text-base max-w-xl mt-3">
              Each portfolio generates unique typography pairs, spacing density, and bespoke storytelling components.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Archetype 1 */}
            <div className="bg-[#1c1c1a] rounded-2xl border border-[#2a2a29] overflow-hidden flex flex-col group hover:border-[#f0bf64]/50 transition-all shadow-xl">
              <div className="h-56 bg-gradient-to-br from-[#20201e] to-[#0e0e0d] p-6 flex flex-col justify-between border-b border-[#2a2a29] relative overflow-hidden">
                <div className="flex justify-between items-center z-10">
                  <span className="font-mono text-[10px] bg-[#f0bf64]/10 text-[#f0bf64] border border-[#f0bf64]/30 px-2 py-0.5 rounded uppercase">
                    Editorial / Creative
                  </span>
                  <span className="font-mono text-xs text-[#8e937f]">v1.0</span>
                </div>
                <div className="z-10">
                  <span className="font-serif italic text-3xl text-[#f0bf64] block leading-tight">
                    Shaping Systems & Narrative
                  </span>
                  <span className="font-sans text-xs text-[#c4c9b3] mt-1 block">
                    Design Director & Brand Architect
                  </span>
                </div>
                <div className="absolute right-3 bottom-0 opacity-10 font-serif text-[120px] leading-none pointer-events-none text-white">
                  &
                </div>
              </div>
              <div className="p-6 flex flex-col gap-4 flex-1 justify-between bg-[#1c1c1a]">
                <p className="text-xs text-[#c4c9b3] leading-relaxed">
                  Generates rich serif hero statements, warm amber accents, bento project showcases, and editorial essay layouts.
                </p>
                <div className="flex items-center justify-between text-xs font-mono text-[#8e937f] border-t border-[#2a2a29] pt-4">
                  <span>Fonts: Instrument + Geist</span>
                  <span className="text-[#f0bf64]">Accent: #F0BF64</span>
                </div>
              </div>
            </div>

            {/* Archetype 2 */}
            <div className="bg-[#1c1c1a] rounded-2xl border border-[#2a2a29] overflow-hidden flex flex-col group hover:border-[#c7f16a]/50 transition-all shadow-xl">
              <div className="h-56 bg-gradient-to-br from-[#1c1c1a] to-[#0e0e0d] p-6 flex flex-col justify-between border-b border-[#2a2a29] relative overflow-hidden">
                <div className="flex justify-between items-center z-10">
                  <span className="font-mono text-[10px] bg-[#c7f16a]/10 text-[#c7f16a] border border-[#c7f16a]/30 px-2 py-0.5 rounded uppercase">
                    Technical / Minimalist
                  </span>
                  <span className="font-mono text-xs text-[#8e937f]">v1.4</span>
                </div>
                <div className="z-10">
                  <span className="font-mono text-2xl font-bold text-[#c7f16a] block leading-tight">
                    dist_systems.rs // 100k rps
                  </span>
                  <span className="font-sans text-xs text-[#c4c9b3] mt-1 block">
                    Staff Infrastructure & Distributed Systems
                  </span>
                </div>
                <div className="absolute right-3 bottom-0 opacity-10 font-mono text-[110px] leading-none pointer-events-none text-white">
                  &gt;_
                </div>
              </div>
              <div className="p-6 flex flex-col gap-4 flex-1 justify-between bg-[#1c1c1a]">
                <p className="text-xs text-[#c4c9b3] leading-relaxed">
                  Synthesizes GitHub telemetry graphs, benchmark metrics, architectural diagrams, and dense monospace telemetry.
                </p>
                <div className="flex items-center justify-between text-xs font-mono text-[#8e937f] border-t border-[#2a2a29] pt-4">
                  <span>Fonts: JetBrains + Geist</span>
                  <span className="text-[#c7f16a]">Accent: #C7F16A</span>
                </div>
              </div>
            </div>

            {/* Archetype 3 */}
            <div className="bg-[#1c1c1a] rounded-2xl border border-[#2a2a29] overflow-hidden flex flex-col group hover:border-[#ffffff]/50 transition-all shadow-xl">
              <div className="h-56 bg-gradient-to-br from-[#20201e] to-[#131312] p-6 flex flex-col justify-between border-b border-[#2a2a29] relative overflow-hidden">
                <div className="flex justify-between items-center z-10">
                  <span className="font-mono text-[10px] bg-white/10 text-white border border-white/30 px-2 py-0.5 rounded uppercase">
                    Executive / Founder
                  </span>
                  <span className="font-mono text-xs text-[#8e937f]">v2.1</span>
                </div>
                <div className="z-10">
                  <span className="font-sans text-2xl font-black text-white block leading-tight">
                    Scaling $0 to $50M ARR
                  </span>
                  <span className="font-sans text-xs text-[#c4c9b3] mt-1 block">
                    Product VP & Multi-time Founder
                  </span>
                </div>
                <div className="absolute right-3 bottom-0 opacity-10 font-sans font-black text-[130px] leading-none pointer-events-none text-white">
                  ▲
                </div>
              </div>
              <div className="p-6 flex flex-col gap-4 flex-1 justify-between bg-[#1c1c1a]">
                <p className="text-xs text-[#c4c9b3] leading-relaxed">
                  High-impact executive summaries, KPI stat counters, investor media features, and boardroom-level clarity.
                </p>
                <div className="flex items-center justify-between text-xs font-mono text-[#8e937f] border-t border-[#2a2a29] pt-4">
                  <span>Fonts: Geist Bold + Sans</span>
                  <span className="text-white">Accent: #FFFFFF</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* ARCHITECTURE COMPARISON */}
        {/* ========================================================================= */}
        <section id="architecture" className="w-full max-w-[1440px] mx-auto px-6 md:px-12 py-24 border-t border-[#2a2a29]">
          <div className="flex flex-col items-center text-center mb-16">
            <span className="font-mono text-xs text-[#c7f16a] uppercase tracking-widest font-semibold mb-2">
              SYSTEM COMPARISON
            </span>
            <h2 className="font-sans text-3xl sm:text-4xl font-bold tracking-tight text-[#e5e2df]">
              Traditional Builders vs Portfolio.ai
            </h2>
            <p className="font-sans text-[#c4c9b3] text-sm sm:text-base max-w-xl mt-3">
              Why generative AST synthesis outperforms static drag-and-drop templates.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Traditional Builders */}
            <div className="bg-[#1c1c1a] rounded-2xl p-8 border border-[#93000a]/40 relative overflow-hidden">
              <div className="flex items-center justify-between mb-6">
                <span className="font-mono text-xs text-[#ffb4ab] uppercase tracking-wider font-semibold">
                  TRADITIONAL BUILDERS
                </span>
                <span className="material-symbols-outlined text-[#ffb4ab]">cancel</span>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-sm text-[#c4c9b3]">
                  <span className="material-symbols-outlined text-[#ffb4ab] text-[18px] shrink-0 mt-0.5">close</span>
                  <span>Manual copy-pasting of job bullet points and dates</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-[#c4c9b3]">
                  <span className="material-symbols-outlined text-[#ffb4ab] text-[18px] shrink-0 mt-0.5">close</span>
                  <span>Rigid, cookie-cutter templates everyone recognizes</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-[#c4c9b3]">
                  <span className="material-symbols-outlined text-[#ffb4ab] text-[18px] shrink-0 mt-0.5">close</span>
                  <span>Frustrating drag-and-drop layout alignment battles</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-[#c4c9b3]">
                  <span className="material-symbols-outlined text-[#ffb4ab] text-[18px] shrink-0 mt-0.5">close</span>
                  <span>Zero semantic understanding of your career trajectory</span>
                </li>
              </ul>
            </div>

            {/* Portfolio.ai */}
            <div className="bg-[#1c1c1a] rounded-2xl p-8 border border-[#c7f16a] relative overflow-hidden shadow-[0_0_40px_rgba(199,241,106,0.15)]">
              <div className="flex items-center justify-between mb-6">
                <span className="font-mono text-xs text-[#c7f16a] uppercase tracking-wider font-semibold">
                  PORTFOLIO.AI ENGINE
                </span>
                <span className="material-symbols-outlined text-[#c7f16a]">check_circle</span>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-sm text-[#e5e2df]">
                  <span className="material-symbols-outlined text-[#c7f16a] text-[18px] shrink-0 mt-0.5">check</span>
                  <span>Instant resume parsing with grounded entity extraction</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-[#e5e2df]">
                  <span className="material-symbols-outlined text-[#c7f16a] text-[18px] shrink-0 mt-0.5">check</span>
                  <span>Bespoke Design DNA synthesized specifically for your role</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-[#e5e2df]">
                  <span className="material-symbols-outlined text-[#c7f16a] text-[18px] shrink-0 mt-0.5">check</span>
                  <span>Conversational AI editor with deterministic AST patches</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-[#e5e2df]">
                  <span className="material-symbols-outlined text-[#c7f16a] text-[18px] shrink-0 mt-0.5">check</span>
                  <span>Production React code ready for one-click edge deployment</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* BOTTOM CTA BANNER */}
        {/* ========================================================================= */}
        <section className="w-full bg-[#1c1c1a] border-t border-[#2a2a29] py-20">
          <div className="max-w-[1000px] mx-auto px-6 text-center flex flex-col items-center">
            <h2 className="font-sans font-black text-3xl sm:text-5xl text-[#e5e2df] mb-4 uppercase tracking-tight">
              Ready to claim your digital identity?
            </h2>
            <p className="font-sans text-[#c4c9b3] text-base max-w-lg mb-8">
              Transform your resume into a bespoke, high-performance portfolio website in under 60 seconds.
            </p>
            <Link
              href="/onboarding"
              className="px-10 py-4 rounded-xl bg-[#c7f16a] hover:bg-[#abd551] text-[#141f00] font-bold text-lg shadow-[0_0_35px_rgba(199,241,106,0.35)] transition-all flex items-center gap-2 group"
            >
              <span>Get Started Now</span>
              <span className="material-symbols-outlined text-[22px] transition-transform duration-200 group-hover:translate-x-1">
                arrow_forward
              </span>
            </Link>
          </div>
        </section>
      </main>

      {/* ========================================================================= */}
      {/* TECHNICAL FOOTER */}
      {/* ========================================================================= */}
      <footer className="w-full bg-[#0e0e0d] border-t border-[#2a2a29] py-12">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded bg-[#c7f16a] flex items-center justify-center font-bold text-[#141f00] text-xs">
              ▲
            </div>
            <span className="font-sans text-sm text-[#e5e2df] font-bold">Portfolio.ai</span>
            <span className="font-mono text-xs text-[#8e937f] ml-2">© 2026 PORTFOLIO.AI INC.</span>
          </div>

          <div className="flex items-center gap-6 text-xs font-mono text-[#8e937f]">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#c7f16a] animate-pulse" />
              STATUS: OPTIMIZED
            </span>
            <a href="#explore" className="hover:text-[#e5e2df] transition-colors">EXPLORE</a>
            <a href="#showcase" className="hover:text-[#e5e2df] transition-colors">SHOWCASE</a>
            <a href="#architecture" className="hover:text-[#e5e2df] transition-colors">ARCHITECTURE</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
