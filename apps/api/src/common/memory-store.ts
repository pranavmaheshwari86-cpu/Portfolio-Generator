import type { ProfessionalProfile, PortfolioSchema, QAResult } from '@portfolio-ai/types';

export interface MemoryUser {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  profession?: string | null;
  role: string;
  plan: string;
}

export interface MemoryResume {
  id: string;
  userId: string;
  fileUrl: string;
  fileName: string;
  extractedText: string;
  parsedData: ProfessionalProfile;
  status: string;
  createdAt: Date;
}

export interface MemoryProfile {
  id: string;
  userId: string;
  profession: string;
  seniority: string;
  headline: string;
  summary: string;
  profileData: ProfessionalProfile;
}

export interface MemoryPortfolio {
  id: string;
  userId: string;
  name: string;
  slug: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  version: number;
  publishedUrl?: string;
  designDNA: PortfolioSchema['designDNA'];
  schemaData: PortfolioSchema;
  createdAt: Date;
  updatedAt: Date;
}

export interface MemoryGeneration {
  id: string;
  userId: string;
  portfolioId?: string;
  status: string;
  rawPrompt: string;
  provider: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
  latencyMs: number;
  estimatedCostUsd: string;
  qaResult?: QAResult;
  createdAt: Date;
}

export class MemoryStore {
  static users = new Map<string, MemoryUser>();
  static resumes = new Map<string, MemoryResume>();
  static profiles = new Map<string, MemoryProfile>();
  static portfolios = new Map<string, MemoryPortfolio>();
  static generations = new Map<string, MemoryGeneration>();
  static analytics = new Map<string, { pageViews: number; uniqueVisitors: number; ctaClicks: number }>();
}
