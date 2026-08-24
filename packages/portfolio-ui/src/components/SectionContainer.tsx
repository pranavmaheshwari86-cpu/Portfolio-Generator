import React from 'react';
import { cn } from '../utils.js';
import type { DesignDNA } from '@portfolio-ai/types';

interface SectionContainerProps {
  id?: string;
  className?: string;
  designDNA?: DesignDNA;
  children: React.ReactNode;
}

export const SectionContainer: React.FC<SectionContainerProps> = ({
  id,
  className,
  designDNA,
  children,
}) => {
  const densityPadding =
    designDNA?.density === 'compact'
      ? 'py-12 md:py-16'
      : designDNA?.density === 'spacious'
      ? 'py-24 md:py-36'
      : 'py-16 md:py-24';

  return (
    <section id={id} className={cn('w-full px-4 sm:px-6 md:px-8 lg:px-10', densityPadding, className)}>
      <div className="max-w-6xl mx-auto w-full">{children}</div>
    </section>
  );
};
