import React from 'react';
import type { PortfolioSchema, PortfolioSection } from '@portfolio-ai/types';
import { Navbar } from './Navbar.js';
import { Footer } from './Footer.js';
import { HeroSplit } from './Hero/HeroSplit.js';
import { HeroCentered } from './Hero/HeroCentered.js';
import { HeroObsidianEditorial } from './Hero/HeroObsidianEditorial.js';
import { HeroLimeStudio } from './Hero/HeroLimeStudio.js';
import { HeroSignaturePersonal } from './Hero/HeroSignaturePersonal.js';
import { ProjectAsymmetric } from './Work/ProjectAsymmetric.js';
import { ProjectsObsidianEditorial } from './Work/ProjectsObsidianEditorial.js';
import { ProjectsLimeStudio } from './Work/ProjectsLimeStudio.js';
import { ProjectsSignaturePersonal } from './Work/ProjectsSignaturePersonal.js';
import { SkillsMatrix } from './Skills/SkillsMatrix.js';
import { ExperienceTimeline } from './Experience/ExperienceTimeline.js';
import { ContactSplit } from './Contact/ContactSplit.js';
import { cn } from '../utils.js';

interface PortfolioRendererProps {
  portfolio: PortfolioSchema;
  className?: string;
}

export const PortfolioRenderer: React.FC<PortfolioRendererProps> = ({ portfolio, className }) => {
  const { designDNA, navigation, sections, footer } = portfolio;
  const isDark = designDNA.colorMode === 'dark';
  const style = designDNA.visualStyle;

  const renderSection = (section: PortfolioSection) => {
    if (!section.visible) return null;

    switch (section.type) {
      case 'hero':
        if (style === 'obsidian-editorial' || section.variant === 'obsidian-editorial') {
          return <HeroObsidianEditorial key={section.id} section={section} designDNA={designDNA} />;
        }
        if (style === 'lime-studio' || section.variant === 'lime-studio') {
          return <HeroLimeStudio key={section.id} section={section} designDNA={designDNA} />;
        }
        if (style === 'signature-personal' || section.variant === 'signature-personal') {
          return <HeroSignaturePersonal key={section.id} section={section} designDNA={designDNA} />;
        }
        if (section.variant === 'centered-clean' || section.variant === 'centered-minimal') {
          return <HeroCentered key={section.id} section={section} designDNA={designDNA} />;
        }
        return <HeroSplit key={section.id} section={section} designDNA={designDNA} />;

      case 'selected-work':
      case 'project-grid':
        if (style === 'obsidian-editorial' || section.variant === 'obsidian-editorial') {
          return <ProjectsObsidianEditorial key={section.id} section={section} designDNA={designDNA} />;
        }
        if (style === 'lime-studio' || section.variant === 'lime-studio') {
          return <ProjectsLimeStudio key={section.id} section={section} designDNA={designDNA} />;
        }
        if (style === 'signature-personal' || section.variant === 'signature-personal') {
          return <ProjectsSignaturePersonal key={section.id} section={section} designDNA={designDNA} />;
        }
        return <ProjectAsymmetric key={section.id} section={section} designDNA={designDNA} />;

      case 'skills':
        return <SkillsMatrix key={section.id} section={section} designDNA={designDNA} />;

      case 'experience':
        return <ExperienceTimeline key={section.id} section={section} designDNA={designDNA} />;

      case 'contact':
        return <ContactSplit key={section.id} section={section} designDNA={designDNA} portfolioId={portfolio.id} />;

      default:
        return null;
    }
  };

  const sortedSections = [...sections].sort((a, b) => a.order - b.order);

  return (
    <div
      className={cn(
        'min-h-screen w-full transition-colors flex flex-col font-sans selection:bg-emerald-500/20 selection:text-emerald-400',
        isDark ? 'bg-[#09090B] text-zinc-100' : 'bg-[#FAF8F4] text-[#1C1917]',
        className
      )}
      style={{
        backgroundColor: designDNA.colorPalette.background,
        color: designDNA.colorPalette.foreground,
        fontFamily: designDNA.typography.bodyFont,
      }}
    >
      <Navbar navigation={navigation} designDNA={designDNA} />

      <main className="flex-1 flex flex-col">
        {sortedSections.map((section) => renderSection(section))}
      </main>

      <Footer footer={footer} designDNA={designDNA} />
    </div>
  );
};
