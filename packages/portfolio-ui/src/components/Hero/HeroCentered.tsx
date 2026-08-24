import React from 'react';
import { SectionContainer } from '../SectionContainer.js';
import type { PortfolioSection, DesignDNA } from '@portfolio-ai/types';
import { cn } from '../../utils.js';

interface HeroProps {
  section: PortfolioSection;
  designDNA: DesignDNA;
}

export const HeroCentered: React.FC<HeroProps> = ({ section, designDNA }) => {
  const content = section.content as {
    badgeText?: string;
    headline?: string;
    description?: string;
    primaryCta?: { label: string; targetSectionId: string };
    secondaryCta?: { label: string; targetSectionId: string };
  };

  const isDark = designDNA.colorMode === 'dark';

  return (
    <SectionContainer id={section.id} designDNA={designDNA} className="pt-24 md:pt-36 text-center">
      <div className="flex flex-col items-center max-w-4xl mx-auto gap-6">
        {content.badgeText && (
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border"
            style={{
              borderColor: `${designDNA.colorPalette.accent}40`,
              backgroundColor: `${designDNA.colorPalette.accent}15`,
              color: designDNA.colorPalette.accent,
            }}
          >
            {content.badgeText}
          </div>
        )}

        <h1
          className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08]"
          style={{ fontFamily: designDNA.typography.displayFont }}
        >
          {content.headline || (content as any).title || section.title}
        </h1>

        <p className={cn('text-lg sm:text-xl max-w-2xl leading-relaxed', isDark ? 'text-zinc-400' : 'text-zinc-600')}>
          {content.description || (content as any).bio || (content as any).subtitle || section.subtitle}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          {content.primaryCta && (
            <a
              href={(content.primaryCta as any).href || (content.primaryCta as any).target || `#${content.primaryCta.targetSectionId || 'contact'}`}
              className="px-8 py-3.5 rounded-full text-sm font-semibold transition-all transform active:scale-95 shadow-md"
              style={{
                backgroundColor: designDNA.colorPalette.accent,
                color: designDNA.colorPalette.accentForeground,
              }}
            >
              {content.primaryCta.label || 'Contact Me'}
            </a>
          )}

          {content.secondaryCta && (
            <a
              href={(content.secondaryCta as any).href || (content.secondaryCta as any).target || `#${content.secondaryCta.targetSectionId || 'selected-work'}`}
              className={cn(
                'px-8 py-3.5 rounded-full text-sm font-semibold border transition-all',
                isDark ? 'border-zinc-700 hover:bg-zinc-800 text-zinc-200' : 'border-zinc-300 hover:bg-zinc-100 text-zinc-800'
              )}
            >
              {content.secondaryCta.label || 'View Work'}
            </a>
          )}
        </div>
      </div>
    </SectionContainer>
  );
};
