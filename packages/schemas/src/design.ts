import { z } from 'zod';

export const designDNASchema = z.object({
  visualStyle: z.enum([
    'minimal-editorial',
    'bold-geometric',
    'technical-developer',
    'visual-studio',
    'authoritative-founder',
    'creative-expressive',
    'obsidian-editorial',
    'lime-studio',
    'signature-personal',
  ]),
  density: z.enum(['compact', 'medium', 'spacious']),
  cornerRadius: z.enum(['none', 'small', 'medium', 'full']),
  typography: z.object({
    displayFont: z.string(),
    bodyFont: z.string(),
    monoFont: z.string().optional(),
    scaleRatio: z.number().min(1).max(2).default(1.25),
  }),
  motion: z.enum(['minimal', 'balanced', 'expressive']),
  layoutPattern: z.enum([
    'split-editorial',
    'asymmetric-grid',
    'centered-clean',
    'sidebar-technical',
    'modular-cards',
  ]),
  colorMode: z.enum(['dark', 'light', 'system']),
  colorPalette: z.object({
    background: z.string(),
    surface: z.string(),
    surfaceElevated: z.string(),
    foreground: z.string(),
    muted: z.string(),
    border: z.string(),
    accent: z.string(),
    accentForeground: z.string(),
    secondaryAccent: z.string().optional(),
  }),
  accentStrategy: z.enum(['single-accent', 'duotone', 'monochrome', 'subtle-glow']),
});

export const designPatternSchema = z.object({
  id: z.string(),
  category: z.enum([
    'hero',
    'about',
    'selected-work',
    'project-grid',
    'experience',
    'skills',
    'education',
    'testimonials',
    'metrics',
    'services',
    'contact',
    'footer',
  ]),
  name: z.string(),
  variantKey: z.string(),
  style: z.string(),
  density: z.enum(['compact', 'medium', 'spacious']),
  motion: z.enum(['minimal', 'balanced', 'expressive']),
  bestForIndustries: z.array(z.string()),
  qualityScore: z.number().min(0).max(1),
  componentPath: z.string(),
});

export type DesignDNA = z.infer<typeof designDNASchema>;
export type DesignPattern = z.infer<typeof designPatternSchema>;
