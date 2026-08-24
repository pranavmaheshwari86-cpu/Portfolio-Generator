export type UserRole = 'USER' | 'ADMIN' | 'SUPER_ADMIN';
export type SubscriptionPlan = 'FREE' | 'PRO' | 'ENTERPRISE';
export type SubscriptionStatus = 'ACTIVE' | 'CANCELLED' | 'PAST_DUE';

export type GenerationStatus =
  | 'QUEUED'
  | 'ANALYZING'
  | 'DESIGNING'
  | 'GENERATING'
  | 'BUILDING'
  | 'VALIDATING'
  | 'REFINING'
  | 'COMPLETED'
  | 'FAILED';

export type PortfolioStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export type AIProviderName = 'gemini' | 'openai' | 'anthropic' | 'groq' | 'mock';

export interface TokenUsage {
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  estimatedCostUsd: number;
  latencyMs: number;
}

export interface GenerationEvent {
  step: GenerationStatus;
  message: string;
  progressPercent: number;
  timestamp: string;
  data?: Record<string, unknown>;
}

export interface DesignDNA {
  visualStyle:
    | 'minimal-editorial'
    | 'bold-geometric'
    | 'technical-developer'
    | 'visual-studio'
    | 'authoritative-founder'
    | 'creative-expressive'
    | 'obsidian-editorial'
    | 'lime-studio'
    | 'signature-personal';
  density: 'compact' | 'medium' | 'spacious';
  cornerRadius: 'none' | 'small' | 'medium' | 'full';
  typography: {
    displayFont: string;
    bodyFont: string;
    monoFont?: string;
    scaleRatio?: number;
  };
  motion: 'minimal' | 'balanced' | 'expressive';
  layoutPattern: 'split-editorial' | 'asymmetric-grid' | 'centered-clean' | 'sidebar-technical' | 'modular-cards';
  colorMode: 'dark' | 'light' | 'system';
  colorPalette: {
    background: string;
    surface: string;
    surfaceElevated: string;
    foreground: string;
    muted: string;
    border: string;
    accent: string;
    accentForeground: string;
    secondaryAccent?: string;
  };
  accentStrategy: 'single-accent' | 'duotone' | 'monochrome' | 'subtle-glow';
}

export interface FactSourceReference {
  claim: string;
  source: 'resume' | 'user_prompt' | 'verified_input';
  sourceField?: string;
  confidence: number;
}

export interface ProfessionalProfile {
  name: string;
  headline: string;
  profession: string;
  seniority: 'Junior' | 'Mid' | 'Senior' | 'Lead' | 'Principal' | 'Executive';
  industries: string[];
  summary: string;
  location?: string;
  email?: string;
  phone?: string;
  socials: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    dribbble?: string;
    behance?: string;
    website?: string;
  };
  skills: Array<{
    category: string;
    items: string[];
  }>;
  experience: Array<{
    id: string;
    role: string;
    company: string;
    location?: string;
    startDate: string;
    endDate?: string;
    current?: boolean;
    description: string;
    highlights: string[];
  }>;
  projects: Array<{
    id: string;
    title: string;
    description: string;
    technologies: string[];
    role?: string;
    highlights?: string[];
    liveUrl?: string;
    githubUrl?: string;
    image?: string;
  }>;
  education: Array<{
    id: string;
    degree: string;
    institution: string;
    fieldOfStudy?: string;
    startDate?: string;
    endDate?: string;
    grade?: string;
  }>;
  certifications?: Array<{
    name: string;
    issuer: string;
    date?: string;
    url?: string;
  }>;
  achievements?: Array<{
    title: string;
    description?: string;
    date?: string;
  }>;
  personality: string[];
  targetAudience: string[];
  brandPositioning: string;
  portfolioPriority: string[];
  groundedFacts: FactSourceReference[];
}

export interface EnhancedPromptSpec {
  originalPrompt: string;
  profession: string;
  seniority: string;
  targetAudience: string[];
  brandPersonality: string[];
  visualDirection: string;
  typographyDirection: string;
  colorStrategy: string;
  layoutGrammar: string;
  contentPriority: string[];
  interactionPhilosophy: string;
  keyConversionGoal: string;
}

export type SectionType =
  | 'hero'
  | 'about'
  | 'selected-work'
  | 'project-grid'
  | 'experience'
  | 'skills'
  | 'education'
  | 'testimonials'
  | 'metrics'
  | 'services'
  | 'contact'
  | 'footer';

export interface PortfolioSection {
  id: string;
  type: SectionType;
  variant: string;
  visible: boolean;
  order: number;
  title?: string;
  subtitle?: string;
  content: Record<string, unknown>;
  customStyleOverrides?: Record<string, string>;
}

export interface PortfolioNavigation {
  brandText: string;
  logoUrl?: string;
  links: Array<{
    label: string;
    targetSectionId: string;
  }>;
  ctaButton?: {
    label: string;
    action: 'contact_modal' | 'email_link' | 'external_url' | 'download_resume';
    url?: string;
  };
}

export interface PortfolioSeo {
  title: string;
  description: string;
  keywords: string[];
  ogImage?: string;
  canonicalUrl?: string;
  twitterCard?: 'summary' | 'summary_large_image';
}

export interface PortfolioFooter {
  copyrightText: string;
  socialLinks: Array<{ platform: string; url: string }>;
  backToTopButton: boolean;
}

export interface PortfolioSchema {
  id: string;
  version: number;
  userId: string;
  name: string;
  slug: string;
  status: PortfolioStatus;
  publishedUrl?: string;
  designDNA: DesignDNA;
  seo: PortfolioSeo;
  navigation: PortfolioNavigation;
  sections: PortfolioSection[];
  footer: PortfolioFooter;
}

export interface QAResult {
  overallScore: number; // 0-100
  breakdown: {
    visualQuality: number;
    uxQuality: number;
    accessibility: number;
    contentAccuracy: number;
    responsiveDesign: number;
  };
  passed: boolean;
  issues: Array<{
    severity: 'critical' | 'high' | 'medium' | 'low';
    type: 'layout' | 'contrast' | 'overflow' | 'missing_data' | 'a11y' | 'typo';
    sectionId?: string;
    description: string;
    suggestedFix: string;
  }>;
  autoFixApplied?: boolean;
}
