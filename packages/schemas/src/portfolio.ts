import { z } from 'zod';
import { designDNASchema } from './design.js';

export const portfolioSectionSchema = z.object({
  id: z.string(),
  type: z.enum([
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
  variant: z.string(),
  visible: z.boolean().default(true),
  order: z.number().int().min(0),
  title: z.string().optional(),
  subtitle: z.string().optional(),
  content: z.record(z.any()),
  customStyleOverrides: z.record(z.string()).optional(),
});

export const portfolioNavigationSchema = z.object({
  brandText: z.string(),
  logoUrl: z.string().optional(),
  links: z.array(
    z.object({
      label: z.string(),
      targetSectionId: z.string(),
    })
  ).default([]),
  ctaButton: z.object({
    label: z.string(),
    action: z.enum(['contact_modal', 'email_link', 'external_url', 'download_resume']),
    url: z.string().optional(),
  }).optional(),
});

export const portfolioSeoSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  keywords: z.array(z.string()).default([]),
  ogImage: z.string().optional(),
  canonicalUrl: z.string().optional(),
  twitterCard: z.enum(['summary', 'summary_large_image']).optional().default('summary_large_image'),
});

export const portfolioFooterSchema = z.object({
  copyrightText: z.string(),
  socialLinks: z.array(
    z.object({
      platform: z.string(),
      url: z.string(),
    })
  ).default([]),
  backToTopButton: z.boolean().default(true),
});

export const portfolioSchema = z.object({
  id: z.string().uuid().or(z.string()),
  version: z.number().int().min(1).default(1),
  userId: z.string(),
  name: z.string().min(1),
  slug: z.string().min(1),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('DRAFT'),
  publishedUrl: z.string().optional(),
  designDNA: designDNASchema,
  seo: portfolioSeoSchema,
  navigation: portfolioNavigationSchema,
  sections: z.array(portfolioSectionSchema),
  footer: portfolioFooterSchema,
});

export const patchOperationSchema = z.object({
  path: z.string(),
  operation: z.enum(['replace', 'add', 'remove', 'merge']),
  value: z.any().optional(),
});

export const aiEditorPatchSchema = z.object({
  summary: z.string(),
  operations: z.array(patchOperationSchema),
});

export type PortfolioSection = z.infer<typeof portfolioSectionSchema>;
export type PortfolioNavigation = z.infer<typeof portfolioNavigationSchema>;
export type PortfolioSeo = z.infer<typeof portfolioSeoSchema>;
export type PortfolioFooter = z.infer<typeof portfolioFooterSchema>;
export type PortfolioSchema = z.infer<typeof portfolioSchema>;
export type PatchOperation = z.infer<typeof patchOperationSchema>;
export type AIEditorPatch = z.infer<typeof aiEditorPatchSchema>;
