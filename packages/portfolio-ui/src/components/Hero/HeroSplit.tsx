import React from 'react';
import { SectionContainer } from '../SectionContainer.js';
import type { PortfolioSection, DesignDNA } from '@portfolio-ai/types';
import { cn } from '../../utils.js';

interface HeroProps {
  section: PortfolioSection;
  designDNA: DesignDNA;
}

export const HeroSplit: React.FC<HeroProps> = ({ section, designDNA }) => {
  const content = section.content as {
    badgeText?: string;
    headline?: string;
    description?: string;
    primaryCta?: { label: string; targetSectionId: string };
    secondaryCta?: { label: string; targetSectionId: string };
    stats?: Array<{ label: string; value: string }>;
  };

  const isDark = designDNA.colorMode === 'dark';

  return (
    <SectionContainer id={section.id} designDNA={designDNA} className="pt-20 md:pt-32">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-8 flex flex-col items-start gap-6">
          {content.badgeText && (
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border"
              style={{
                borderColor: `${designDNA.colorPalette.accent}40`,
                backgroundColor: `${designDNA.colorPalette.accent}15`,
                color: designDNA.colorPalette.accent,
              }}
            >
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: designDNA.colorPalette.accent }} />
              {content.badgeText}
            </div>
          )}

          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1]"
            style={{ fontFamily: designDNA.typography.displayFont }}
          >
            {content.headline || (content as any).title || section.title}
          </h1>

          <p className={cn('text-lg sm:text-xl max-w-2xl leading-relaxed', isDark ? 'text-zinc-400' : 'text-zinc-600')}>
            {content.description || (content as any).bio || (content as any).subtitle || section.subtitle}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            {content.primaryCta && (
              <a
                href={(content.primaryCta as any).href || (content.primaryCta as any).target || `#${content.primaryCta.targetSectionId || 'selected-work'}`}
                className="px-6 py-3 rounded-lg text-sm font-semibold transition-all transform active:scale-95 shadow-md"
                style={{
                  backgroundColor: designDNA.colorPalette.accent,
                  color: designDNA.colorPalette.accentForeground,
                }}
              >
                {content.primaryCta.label || 'View Projects'}
              </a>
            )}

            {content.secondaryCta && (
              <a
                href={(content.secondaryCta as any).href || (content.secondaryCta as any).target || `#${content.secondaryCta.targetSectionId || 'experience'}`}
                className={cn(
                  'px-6 py-3 rounded-lg text-sm font-semibold border transition-all',
                  isDark ? 'border-zinc-700 hover:bg-zinc-800 text-zinc-200' : 'border-zinc-300 hover:bg-zinc-100 text-zinc-800'
                )}
              >
                {content.secondaryCta.label || 'Experience'}
              </a>
            )}
          </div>
        </div>

        {content.stats && content.stats.length > 0 && (
          <div className="lg:col-span-4 flex flex-col gap-4">
            {content.stats.map((stat, i) => (
              <div
                key={i}
                className={cn(
                  'p-6 rounded-xl border backdrop-blur-sm transition-all hover:translate-x-1',
                  isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-white/70 border-zinc-200 shadow-sm'
                )}
              >
                <div
                  className="text-3xl font-black tracking-tight"
                  style={{ color: designDNA.colorPalette.accent }}
                >
                  {stat.value}
                </div>
                <div className={cn('text-xs uppercase tracking-wider font-semibold mt-1', isDark ? 'text-zinc-400' : 'text-zinc-500')}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </SectionContainer>
  );
};
