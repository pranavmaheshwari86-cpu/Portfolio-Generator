import React from 'react';
import { SectionContainer } from '../SectionContainer.js';
import type { PortfolioSection, DesignDNA } from '@portfolio-ai/types';
import { ArrowUpRight } from 'lucide-react';

interface HeroProps {
  section: PortfolioSection;
  designDNA: DesignDNA;
}

export const HeroLimeStudio: React.FC<HeroProps> = ({ section, designDNA }) => {
  const content = section.content as {
    badgeText?: string;
    headline?: string;
    bio?: string;
    description?: string;
    primaryCtaText?: string;
    primaryCtaLink?: string;
    secondaryCtaText?: string;
    secondaryCtaLink?: string;
  };

  const rawName = (content as any).name || section.title || 'Alexander Wright';
  const nameParts = rawName.split(' ');
  const firstName = nameParts[0] || 'ALEXANDER';
  const lastName = nameParts.slice(1).join(' ') || 'WRIGHT';

  const subtitle = content.headline || section.subtitle || 'LEAD CREATIVE TECHNOLOGIST & SYSTEMS ARCHITECT';
  const bio =
    content.bio ||
    content.description ||
    'Developing high-throughput AI systems, performant interfaces, and modular backend infrastructures.';

  const accentLime = designDNA.colorPalette.accent || '#C7FF00';

  return (
    <SectionContainer id={section.id} designDNA={designDNA} className="pt-20 md:pt-28 pb-16">
      <div className="w-full max-w-[1440px] mx-auto flex flex-col gap-10">
        {/* Signal HUD Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-[#161614] border border-[#282824]">
          <div className="flex items-center gap-3">
            <span className="relative flex h-2.5 w-2.5">
              <span
                className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                style={{ backgroundColor: accentLime }}
              />
              <span
                className="relative inline-flex rounded-full h-2.5 w-2.5"
                style={{ backgroundColor: accentLime }}
              />
            </span>
            <span className="font-mono text-xs font-bold tracking-widest text-[#EDEDED] uppercase">
              STUDIO STATUS: ACTIVE & AVAILABLE
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-[#7E8270]">
            <span className="hidden sm:inline">STACK: NEXT.JS // NESTJS // AI</span>
            <span className="px-2 py-0.5 rounded bg-[#20201D] text-[#EDEDED] border border-[#282824]">
              V2.4 ENGINE
            </span>
          </div>
        </div>

        {/* 80vw Massive Split-Scale Uppercase Condensed Display Name */}
        <div className="flex flex-col select-none">
          <div className="flex items-baseline justify-between overflow-hidden">
            <span
              className="text-6xl sm:text-8xl md:text-9xl lg:text-[11rem] font-black uppercase tracking-tighter leading-[0.85] text-[#EDEDED]"
              style={{ fontFamily: designDNA.typography.displayFont || 'Space Grotesk, sans-serif' }}
            >
              {firstName}
            </span>
            <span
              className="hidden lg:block text-2xl font-mono uppercase tracking-widest pb-4"
              style={{ color: accentLime }}
            >
              // 02
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 border-b border-[#282824] pb-6">
            <span
              className="text-5xl sm:text-7xl md:text-8xl lg:text-[9.5rem] font-black uppercase tracking-tighter leading-[0.85]"
              style={{
                fontFamily: designDNA.typography.displayFont || 'Space Grotesk, sans-serif',
                WebkitTextStroke: `1.5px ${accentLime}`,
                color: 'transparent',
              }}
            >
              {lastName}
            </span>

            <div className="flex flex-col items-start sm:items-end gap-1">
              <span className="font-mono text-xs text-[#7E8270] uppercase tracking-widest">
                ROLE CLASSIFICATION
              </span>
              <span className="font-mono text-xs sm:text-sm font-semibold text-[#EDEDED] uppercase">
                {subtitle}
              </span>
            </div>
          </div>
        </div>

        {/* Narrative & Action Bar */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center pt-2">
          <div className="md:col-span-8">
            <p className="text-base sm:text-xl text-[#A3A39E] font-sans leading-relaxed max-w-3xl">
              {bio}
            </p>
          </div>

          <div className="md:col-span-4 flex flex-wrap sm:justify-end gap-4">
            <a
              href={content.primaryCtaLink || '#work'}
              className="px-8 py-4 rounded-lg font-mono font-bold text-xs uppercase tracking-widest flex items-center gap-2 transition-all hover:brightness-110 active:scale-95 shadow-[0_0_25px_rgba(199,255,0,0.25)]"
              style={{
                backgroundColor: accentLime,
                color: '#000000',
              }}
            >
              <span>Explore Projects</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>

            <a
              href={content.secondaryCtaLink || '#contact'}
              className="px-6 py-4 rounded-lg border border-[#282824] bg-[#161614] hover:bg-[#20201D] text-[#EDEDED] font-mono text-xs uppercase tracking-widest transition-all"
            >
              Connect
            </a>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
};
