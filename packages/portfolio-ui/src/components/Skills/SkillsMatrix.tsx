import React from 'react';
import { SectionContainer } from '../SectionContainer.js';
import type { PortfolioSection, DesignDNA } from '@portfolio-ai/types';
import { cn } from '../../utils.js';

interface SkillsProps {
  section: PortfolioSection;
  designDNA: DesignDNA;
}

export const SkillsMatrix: React.FC<SkillsProps> = ({ section, designDNA }) => {
  const content = section.content as {
    categories?: Array<{
      category: string;
      items: string[];
    }>;
  };

  const isDark = designDNA.colorMode === 'dark';
  const categories = Array.isArray(content?.categories)
    ? content.categories
    : Array.isArray((content as any)?.skills)
    ? (content as any).skills
    : [];

  return (
    <SectionContainer id={section.id} designDNA={designDNA}>
      <div className="flex flex-col gap-12">
        <div className="flex flex-col items-start gap-3">
          <h2
            className="text-3xl sm:text-4xl font-bold tracking-tight"
            style={{ fontFamily: designDNA.typography.displayFont }}
          >
            {section.title || 'Technical Capabilities'}
          </h2>
          {section.subtitle && (
            <p className={cn('text-base max-w-xl', isDark ? 'text-zinc-400' : 'text-zinc-600')}>
              {section.subtitle}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((cat: any, idx: number) => {
            const rawItems = cat.items || cat.skills || [];
            const items: string[] = Array.isArray(rawItems) ? rawItems : typeof rawItems === 'string' ? [rawItems] : [];
            const title = cat.category || cat.name || 'Competencies';

            return (
              <div
                key={idx}
                className={cn(
                  'rounded-xl border p-6 flex flex-col gap-4',
                  isDark ? 'bg-zinc-900/40 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'
                )}
              >
                <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
                  {title}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {items.map((item, iIdx) => (
                    <span
                      key={iIdx}
                      className={cn(
                        'text-xs px-3 py-1.5 rounded-lg font-medium transition-all hover:scale-105',
                        isDark ? 'bg-zinc-800 text-zinc-200' : 'bg-zinc-100 text-zinc-800'
                      )}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </SectionContainer>
  );
};
