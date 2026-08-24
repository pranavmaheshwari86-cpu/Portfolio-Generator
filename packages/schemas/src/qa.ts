import { z } from 'zod';

export const qaIssueSchema = z.object({
  severity: z.enum(['critical', 'high', 'medium', 'low']),
  type: z.enum(['layout', 'contrast', 'overflow', 'missing_data', 'a11y', 'typo']),
  sectionId: z.string().optional(),
  description: z.string(),
  suggestedFix: z.string(),
});

export const qaResultSchema = z.object({
  overallScore: z.number().min(0).max(100),
  breakdown: z.object({
    visualQuality: z.number().min(0).max(100),
    uxQuality: z.number().min(0).max(100),
    accessibility: z.number().min(0).max(100),
    contentAccuracy: z.number().min(0).max(100),
    responsiveDesign: z.number().min(0).max(100),
  }),
  passed: z.boolean(),
  issues: z.array(qaIssueSchema),
  autoFixApplied: z.boolean().optional().default(false),
});

export type QAIssue = z.infer<typeof qaIssueSchema>;
export type QAResult = z.infer<typeof qaResultSchema>;
