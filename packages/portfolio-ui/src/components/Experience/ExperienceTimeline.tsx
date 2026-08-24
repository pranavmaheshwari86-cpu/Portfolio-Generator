import React from 'react';
import { SectionContainer } from '../SectionContainer.js';
import type { PortfolioSection, DesignDNA } from '@portfolio-ai/types';
import { cn } from '../../utils.js';

interface ExperienceProps {
  section: PortfolioSection;
  designDNA: DesignDNA;
}

export const ExperienceTimeline: React.FC<ExperienceProps> = ({ section, designDNA }) => {
  const content = section.content as {
    roles?: Array<{
      role: string;
      company: string;
      location?: string;
      period: string;
      description: string;
      highlights?: string[];
    }>;
  };

  const isDark = designDNA.colorMode === 'dark';
  const roles = Array.isArray(content?.roles)
    ? content.roles
    : Array.isArray((content as any)?.items)
    ? (content as any).items
    : Array.isArray((content as any)?.experiences)
    ? (content as any).experiences
    : [];

  return (
    <SectionContainer id={section.id} designDNA={designDNA}>
      <div className="flex flex-col gap-12">
        <div className="flex flex-col items-start gap-3">
          <h2
            className="text-3xl sm:text-4xl font-bold tracking-tight"
            style={{ fontFamily: designDNA.typography.displayFont }}
          >
            {section.title || 'Work History'}
          </h2>
          {section.subtitle && (
            <p className={cn('text-base max-w-xl', isDark ? 'text-zinc-400' : 'text-zinc-600')}>
              {section.subtitle}
            </p>
          )}
        </div>

        <div className="relative pl-6 md:pl-8 border-l border-zinc-800 flex flex-col gap-12">
          {roles.map((item: any, idx: number) => (
            <div key={idx} className="relative flex flex-col gap-3">
              <span
                className="absolute -left-[31px] md:-left-[39px] top-1.5 w-3.5 h-3.5 rounded-full border-2 border-black"
                style={{ backgroundColor: designDNA.colorPalette.accent }}
              />
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-bold">{item.role || item.title || 'Role'}</h3>
                  {(item.company || item.organization) && (
                    <span className="text-sm font-semibold text-emerald-400">@ {item.company || item.organization}</span>
                  )}
                </div>
                <span className="text-xs font-mono text-zinc-500 uppercase">{item.period || item.duration || ''}</span>
              </div>

              <p className={cn('text-sm max-w-3xl leading-relaxed', isDark ? 'text-zinc-400' : 'text-zinc-600')}>
                {item.description}
              </p>

              {item.highlights && item.highlights.length > 0 && (
                <ul className="flex flex-col gap-1.5 mt-2">
                  {item.highlights.map((highlight: string, hIdx: number) => (
                    <li key={hIdx} className="text-xs text-zinc-400 flex items-start gap-2">
                      <span className="text-emerald-500 font-bold">→</span>
                      {highlight}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </SectionContainer>
  );
};
