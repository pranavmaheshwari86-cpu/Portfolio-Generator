import type { DesignDNA, PortfolioSchema, ProfessionalProfile } from '@portfolio-ai/types';

export interface TemplateDefinition {
  id: 'obsidian-editorial' | 'lime-studio' | 'signature-personal';
  name: string;
  tagline: string;
  description: string;
  badge: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  displayFont: string;
  designDNA: DesignDNA;
}

export const PORTFOLIO_TEMPLATES: Record<string, TemplateDefinition> = {
  'obsidian-editorial': {
    id: 'obsidian-editorial',
    name: 'Obsidian Editorial',
    tagline: 'Swiss Grid · Muted Gold · Oversized Serif',
    description:
      'Swiss grid, oversized serif/grotesk headlines, deliberate negative space, and horizontal rules as structural devices. Signature project numbers as typographic anchors with a massive display font bleeding into the layout.',
    badge: 'Template 01',
    accentColor: '#C9A96E',
    backgroundColor: '#0B0B0B',
    textColor: '#F5F3EE',
    displayFont: 'Instrument Serif, Georgia, serif',
    designDNA: {
      visualStyle: 'obsidian-editorial',
      density: 'spacious',
      cornerRadius: 'none',
      typography: {
        displayFont: 'Instrument Serif, Georgia, serif',
        bodyFont: 'Inter, -apple-system, sans-serif',
        monoFont: 'JetBrains Mono, monospace',
        scaleRatio: 1.33,
      },
      motion: 'minimal',
      layoutPattern: 'asymmetric-grid',
      colorMode: 'dark',
      colorPalette: {
        background: '#0B0B0B',
        surface: '#141414',
        surfaceElevated: '#1D1D1C',
        foreground: '#F5F3EE',
        muted: '#9E9B91',
        border: '#262624',
        accent: '#C9A96E',
        accentForeground: '#0B0B0B',
        secondaryAccent: '#8E7C58',
      },
      accentStrategy: 'duotone',
    },
  },
  'lime-studio': {
    id: 'lime-studio',
    name: 'Lime Studio',
    tagline: 'Split-Screen Boldness · Signal Lime · 80vw Display',
    description:
      'Split-screen boldness featuring a hero where the name is divided across two typographic scales filling 80vw. High-contrast Obsidian with electric Lime used sparingly as a signal color, presenting projects as an indexed list with number-keyed hover reveals.',
    badge: 'Template 02',
    accentColor: '#C7FF00',
    backgroundColor: '#0E0E0D',
    textColor: '#EDEDED',
    displayFont: 'Space Grotesk, Syne, sans-serif',
    designDNA: {
      visualStyle: 'lime-studio',
      density: 'compact',
      cornerRadius: 'small',
      typography: {
        displayFont: 'Space Grotesk, Syne, sans-serif',
        bodyFont: 'Inter, -apple-system, sans-serif',
        monoFont: 'JetBrains Mono, monospace',
        scaleRatio: 1.25,
      },
      motion: 'expressive',
      layoutPattern: 'split-editorial',
      colorMode: 'dark',
      colorPalette: {
        background: '#0E0E0D',
        surface: '#161614',
        surfaceElevated: '#20201D',
        foreground: '#EDEDED',
        muted: '#7E8270',
        border: '#282824',
        accent: '#C7FF00',
        accentForeground: '#000000',
        secondaryAccent: '#C7F16A',
      },
      accentStrategy: 'single-accent',
    },
  },
  'signature-personal': {
    id: 'signature-personal',
    name: 'Signature Personal',
    tagline: 'Photo-Forward · Warm Neutrals · Sticky Currently Bio',
    description:
      'Photo-forward, warm neutrals (#FAF8F4) with editorial serif for personal warmth. Features a split layout where the portrait occupies a fixed-width sticky column while narrative text scrolls beside it, with a signature "Currently" section.',
    badge: 'Template 03',
    accentColor: '#C4956A',
    backgroundColor: '#FAF8F4',
    textColor: '#1C1917',
    displayFont: 'Playfair Display, Instrument Serif, serif',
    designDNA: {
      visualStyle: 'signature-personal',
      density: 'medium',
      cornerRadius: 'medium',
      typography: {
        displayFont: 'Playfair Display, Instrument Serif, serif',
        bodyFont: 'Plus Jakarta Sans, Inter, sans-serif',
        monoFont: 'JetBrains Mono, monospace',
        scaleRatio: 1.25,
      },
      motion: 'balanced',
      layoutPattern: 'split-editorial',
      colorMode: 'light',
      colorPalette: {
        background: '#FAF8F4',
        surface: '#F2EEE7',
        surfaceElevated: '#EAE3D6',
        foreground: '#1C1917',
        muted: '#78716C',
        border: '#E3DCD1',
        accent: '#C4956A',
        accentForeground: '#FFFFFF',
        secondaryAccent: '#8C5A3E',
      },
      accentStrategy: 'single-accent',
    },
  },
};

export function getTemplatePreset(templateId: string): TemplateDefinition {
  return PORTFOLIO_TEMPLATES[templateId] || PORTFOLIO_TEMPLATES['obsidian-editorial'];
}

export function applyTemplateToPortfolio(
  portfolio: PortfolioSchema,
  templateId: 'obsidian-editorial' | 'lime-studio' | 'signature-personal'
): PortfolioSchema {
  const template = getTemplatePreset(templateId);
  const updated = JSON.parse(JSON.stringify(portfolio)) as PortfolioSchema;

  updated.designDNA = { ...template.designDNA };

  // Adjust section variants if necessary
  if (Array.isArray(updated.sections)) {
    for (const sec of updated.sections) {
      if (sec.type === 'hero') {
        sec.variant = template.id;
      } else if (sec.type === 'selected-work' || sec.type === 'project-grid') {
        sec.variant = template.id;
      }
    }
  }

  return updated;
}
