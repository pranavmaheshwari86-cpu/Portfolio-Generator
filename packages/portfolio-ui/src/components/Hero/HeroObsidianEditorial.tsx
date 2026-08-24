import React from 'react';
import { SectionContainer } from '../SectionContainer.js';
import type { PortfolioSection, DesignDNA } from '@portfolio-ai/types';
import { ArrowDownRight } from 'lucide-react';

interface HeroProps {
  section: PortfolioSection;
  designDNA: DesignDNA;
}

export const HeroObsidianEditorial: React.FC<HeroProps> = ({ section, designDNA }) => {
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

  const name = (content as any).name || section.title || 'Alexander Wright';
  const subtitle = content.headline || section.subtitle || 'Systems Architect & Creative Director';
  const bio =
    content.bio ||
    content.description ||
    'Architecting high-scale distributed systems and minimal editorial interfaces with mathematical precision and uncompromising craft.';

  const accentColor = designDNA.colorPalette.accent || '#C9A96E';
  const mutedColor = designDNA.colorPalette.muted || '#9E9B91';

  return (
    <SectionContainer id={section.id} designDNA={designDNA} className="pt-20 md:pt-28 pb-16">
      <div className="w-full max-w-[1440px] mx-auto flex flex-col">
        {/* Top Swiss Metadata Rule */}
        <div className="w-full flex items-center justify-between border-b border-[#262624] pb-4 mb-8 text-xs font-mono tracking-widest uppercase">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }} />
            <span style={{ color: accentColor }}>[ 01 // SWISS EDITORIAL GRID ]</span>
          </div>
          <span style={{ color: mutedColor }}>ARCHITECTURAL DISCIPLINE</span>
          <span className="hidden sm:inline" style={{ color: mutedColor }}>
            LOC: SAN FRANCISCO / GLOBAL
          </span>
        </div>

        {/* Massive Bleeding Display Name Header */}
        <div className="relative overflow-hidden py-4 border-b border-[#262624]">
          <h1
            className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-normal tracking-tight leading-[0.95] text-[#F5F3EE] select-none"
            style={{ fontFamily: designDNA.typography.displayFont || 'Instrument Serif, Georgia, serif' }}
          >
            {name}
          </h1>
        </div>

        {/* Structural Sub-Grid with Horizontal Rules */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8 items-start border-b border-[#262624] pb-12">
          {/* Subtitle / Role Column */}
          <div className="lg:col-span-4 flex flex-col gap-3">
            <span className="font-mono text-xs uppercase tracking-wider" style={{ color: accentColor }}>
              DISCIPLINE & POSITIONING
            </span>
            <p className="text-xl sm:text-2xl font-light text-[#F5F3EE] tracking-tight leading-snug">
              {subtitle}
            </p>
          </div>

          {/* Bio Narrative Column */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <span className="font-mono text-xs uppercase tracking-wider" style={{ color: mutedColor }}>
              STATEMENT OF INTENT
            </span>
            <p className="text-base sm:text-lg leading-relaxed font-sans" style={{ color: '#D6D3CC' }}>
              {bio}
            </p>
          </div>

          {/* Action Anchors */}
          <div className="lg:col-span-3 flex flex-col gap-4 lg:items-end">
            <a
              href={content.primaryCtaLink || '#work'}
              className="inline-flex items-center gap-3 px-6 py-3.5 border transition-all text-xs font-mono uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98]"
              style={{
                borderColor: accentColor,
                backgroundColor: `${accentColor}15`,
                color: accentColor,
              }}
            >
              <span>Explore Selected Work</span>
              <ArrowDownRight className="w-4 h-4" />
            </a>

            <a
              href={content.secondaryCtaLink || '#contact'}
              className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#9E9B91] hover:text-[#F5F3EE] transition-colors"
            >
              <span>Direct Inquiries</span>
              <span>→</span>
            </a>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
};
