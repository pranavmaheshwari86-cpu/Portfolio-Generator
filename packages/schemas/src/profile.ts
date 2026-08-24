import { z } from 'zod';

export const factSourceReferenceSchema = z.object({
  claim: z.string(),
  source: z.enum(['resume', 'user_prompt', 'verified_input']),
  sourceField: z.string().optional(),
  confidence: z.number().min(0).max(1),
});

export const professionalProfileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  headline: z.string().min(1, 'Headline is required'),
  profession: z.string().min(1, 'Profession is required'),
  seniority: z.enum(['Junior', 'Mid', 'Senior', 'Lead', 'Principal', 'Executive']),
  industries: z.array(z.string()).default([]),
  summary: z.string().min(1, 'Summary is required'),
  location: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional(),
  socials: z.object({
    github: z.string().optional(),
    linkedin: z.string().optional(),
    twitter: z.string().optional(),
    dribbble: z.string().optional(),
    behance: z.string().optional(),
    website: z.string().optional(),
  }).default({}),
  skills: z.array(
    z.object({
      category: z.string(),
      items: z.array(z.string()),
    })
  ).default([]),
  experience: z.array(
    z.object({
      id: z.string(),
      role: z.string(),
      company: z.string(),
      location: z.string().optional(),
      startDate: z.string(),
      endDate: z.string().optional(),
      current: z.boolean().optional().default(false),
      description: z.string(),
      highlights: z.array(z.string()).default([]),
    })
  ).default([]),
  projects: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      description: z.string(),
      technologies: z.array(z.string()).default([]),
      role: z.string().optional(),
      highlights: z.array(z.string()).default([]),
      liveUrl: z.string().url().optional().or(z.literal('')),
      githubUrl: z.string().url().optional().or(z.literal('')),
      image: z.string().optional(),
    })
  ).default([]),
  education: z.array(
    z.object({
      id: z.string(),
      degree: z.string(),
      institution: z.string(),
      fieldOfStudy: z.string().optional(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      grade: z.string().optional(),
    })
  ).default([]),
  certifications: z.array(
    z.object({
      name: z.string(),
      issuer: z.string(),
      date: z.string().optional(),
      url: z.string().optional(),
    })
  ).optional().default([]),
  achievements: z.array(
    z.object({
      title: z.string(),
      description: z.string().optional(),
      date: z.string().optional(),
    })
  ).optional().default([]),
  personality: z.array(z.string()).default([]),
  targetAudience: z.array(z.string()).default([]),
  brandPositioning: z.string().default(''),
  portfolioPriority: z.array(z.string()).default([]),
  groundedFacts: z.array(factSourceReferenceSchema).default([]),
});

export type ProfessionalProfileInput = z.infer<typeof professionalProfileSchema>;
