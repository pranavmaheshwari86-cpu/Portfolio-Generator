import { Injectable, BadRequestException } from '@nestjs/common';
import {
  AIService,
  SYSTEM_PROMPT_ENHANCER,
  SYSTEM_DESIGN_DNA_AGENT,
  SYSTEM_PORTFOLIO_GENERATOR,
  SYSTEM_QA_VALIDATOR,
  SYSTEM_AI_EDITOR,
} from '@portfolio-ai/ai';
import {
  enhancedPromptSpecSchema,
  designDNASchema,
  portfolioSchema,
  qaResultSchema,
  aiEditorPatchSchema,
  type EnhancePromptInput,
  type EnhancedPromptSpec,
  type PortfolioSchema,
} from '@portfolio-ai/schemas';
import type { ProfessionalProfile, DesignDNA } from '@portfolio-ai/types';

@Injectable()
export class ApiAiService {
  private ai = new AIService();

  async enhancePrompt(input: EnhancePromptInput, profile?: ProfessionalProfile) {
    const profileContext = profile
      ? `\nCandidate Profile:\n- Name: ${profile.name}\n- Profession: ${profile.profession} (${profile.seniority})\n- Key Skills: ${profile.skills.map((s) => s.items.join(', ')).join('; ')}\n- Summary: ${profile.summary}\n- Personality: ${profile.personality.join(', ')}`
      : '';

    const prompt = `User Raw Prompt: "${input.rawPrompt}"\nTarget Audience: ${input.targetAudience?.join(', ') || 'Recruiters and Hiring Managers'}\nVibe Preference: ${input.vibePreference || 'Modern, Premium, High-Impact'}${profileContext}`;

    const response = await this.ai.generateStructured({
      prompt,
      systemInstruction: SYSTEM_PROMPT_ENHANCER,
      schema: enhancedPromptSpecSchema,
      temperature: 0.7,
    });

    return {
      spec: response.data,
      usage: response.usage,
      provider: response.provider,
    };
  }

  async generateDesignDNA(spec: EnhancedPromptSpec, profile: ProfessionalProfile) {
    const prompt = `Synthesize DesignDNA for:\n- Profession: ${profile.profession}\n- Seniority: ${profile.seniority}\n- Visual Direction: ${spec.visualDirection}\n- Typography Direction: ${spec.typographyDirection}\n- Color Strategy: ${spec.colorStrategy}\n- Brand Personality: ${spec.brandPersonality.join(', ')}`;

    const response = await this.ai.generateStructured({
      prompt,
      systemInstruction: SYSTEM_DESIGN_DNA_AGENT,
      schema: designDNASchema,
      temperature: 0.5,
    });

    return {
      designDNA: response.data,
      usage: response.usage,
      provider: response.provider,
    };
  }

  async generatePortfolio(
    userId: string,
    profile: ProfessionalProfile,
    spec: EnhancedPromptSpec,
    designDNA: DesignDNA
  ) {
    const prompt = `Generate Full PortfolioSchema for:\n${JSON.stringify({
      profile,
      spec,
      designDNA,
    }, null, 2)}`;

    const response = await this.ai.generateStructured({
      prompt,
      systemInstruction: SYSTEM_PORTFOLIO_GENERATOR,
      schema: portfolioSchema,
      temperature: 0.3,
    });

    const schemaData = response.data;
    schemaData.userId = userId;
    schemaData.name = `${profile.name} — ${profile.headline}`;
    schemaData.slug = profile.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') || 'my-portfolio';
    schemaData.designDNA = designDNA;

    // Ensure Navigation matches candidate name
    if (schemaData.navigation) {
      schemaData.navigation.brandText = profile.name;
    }

    // Ensure Sections reflect candidate profile
    for (const sec of schemaData.sections) {
      if (sec.type === 'hero' && sec.content) {
        sec.subtitle = `${profile.headline}${profile.location ? ` based in ${profile.location}` : ''}`;
      } else if (sec.type === 'selected-work' && sec.content && profile.projects && profile.projects.length > 0) {
        sec.content.projects = profile.projects;
      } else if (sec.type === 'skills' && sec.content && profile.skills && profile.skills.length > 0) {
        sec.content.categories = profile.skills;
      } else if (sec.type === 'experience' && sec.content && profile.experience && profile.experience.length > 0) {
        sec.content.roles = profile.experience.map((e) => ({
          role: e.role,
          company: e.company,
          location: e.location || 'Remote',
          period: `${e.startDate} — ${e.current ? 'Present' : e.endDate || '2023'}`,
          description: e.description,
          highlights: e.highlights || [],
        }));
      } else if (sec.type === 'contact' && sec.content) {
        sec.content.email = profile.email || 'contact@example.com';
        sec.content.location = profile.location || 'Open to Remote & Global Opportunities';
        sec.content.socials = [
          { platform: 'GitHub', url: profile.socials?.github || 'https://github.com' },
          { platform: 'LinkedIn', url: profile.socials?.linkedin || 'https://linkedin.com' },
        ];
      }
    }

    if (schemaData.footer) {
      schemaData.footer.copyrightText = `© ${new Date().getFullYear()} ${profile.name}. All rights reserved.`;
      schemaData.footer.socialLinks = [
        { platform: 'GitHub', url: profile.socials?.github || 'https://github.com' },
        { platform: 'LinkedIn', url: profile.socials?.linkedin || 'https://linkedin.com' },
      ];
    }

    // Run QA validation pass
    const qaResponse = await this.ai.generateStructured({
      prompt: `Evaluate this generated portfolio schema:\n${JSON.stringify(schemaData, null, 2)}`,
      systemInstruction: SYSTEM_QA_VALIDATOR,
      schema: qaResultSchema,
      temperature: 0.1,
    });

    return {
      portfolio: schemaData,
      qa: qaResponse.data,
      usage: response.usage,
    };
  }

  async applyAIEditorPatch(currentSchema: PortfolioSchema, instruction: string) {
    const prompt = `Current Portfolio Schema:\n${JSON.stringify(currentSchema, null, 2)}\n\nUser Instruction to Apply:\n"${instruction}"`;

    const response = await this.ai.generateStructured({
      prompt,
      systemInstruction: SYSTEM_AI_EDITOR,
      schema: aiEditorPatchSchema,
      temperature: 0.2,
    });

    const patch = response.data;
    const modifiedSchema = JSON.parse(JSON.stringify(currentSchema)) as PortfolioSchema;

    for (const op of patch.operations) {
      this.applyPatchOperation(modifiedSchema, op.path, op.operation, op.value);
    }

    modifiedSchema.version = (modifiedSchema.version || 1) + 1;

    return {
      summary: patch.summary,
      operations: patch.operations,
      updatedPortfolio: modifiedSchema,
      usage: response.usage,
    };
  }

  private applyPatchOperation(target: any, rawPath: string, operation: string, value: unknown) {
    if (!rawPath || typeof rawPath !== 'string' || !target || typeof target !== 'object') return;

    let normalized = rawPath.trim();
    if (normalized.startsWith('/')) normalized = normalized.slice(1);
    normalized = normalized.replace(/\//g, '.').replace(/\[(\w+)\]/g, '.$1').replace(/^\./, '');

    const parts = normalized.split('.').filter(Boolean);
    if (parts.length === 0) return;

    const sectionTypes = [
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
    ];

    if (Array.isArray(target.sections)) {
      if (parts[0] === 'sections' && parts.length > 1 && sectionTypes.includes(parts[1])) {
        const secIdx = target.sections.findIndex(
          (s: any) => s.type === parts[1] || s.id === parts[1] || s.id === `section-${parts[1]}`
        );
        if (secIdx !== -1) {
          const targetSec = target.sections[secIdx];
          if (parts.length === 3 && parts[2] !== 'content' && targetSec?.content && typeof targetSec.content === 'object') {
            if (parts[2] in targetSec.content || ['title', 'subtitle', 'bio', 'headline', 'description', 'primaryCta'].includes(parts[2])) {
              targetSec.content[parts[2]] = value;
            }
          }
          parts[1] = String(secIdx);
        }
      } else if (sectionTypes.includes(parts[0])) {
        const secIdx = target.sections.findIndex(
          (s: any) => s.type === parts[0] || s.id === parts[0] || s.id === `section-${parts[0]}`
        );
        if (secIdx !== -1) {
          const targetSec = target.sections[secIdx];
          if (parts.length === 2 && targetSec?.content && typeof targetSec.content === 'object') {
            if (parts[1] in targetSec.content || ['title', 'subtitle', 'bio', 'headline', 'description', 'primaryCta'].includes(parts[1])) {
              targetSec.content[parts[1]] = value;
            }
          }
          parts.unshift('sections');
          parts[1] = String(secIdx);
        }
      }
    }

    let current: any = target;
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (current[part] === undefined || current[part] === null || typeof current[part] !== 'object') {
        const nextPart = parts[i + 1];
        current[part] = /^\d+$/.test(nextPart) ? [] : {};
      }
      current = current[part];
    }

    const lastKey = parts[parts.length - 1];
    if (operation === 'replace' || operation === 'add') {
      current[lastKey] = value;
    } else if (operation === 'remove') {
      if (Array.isArray(current) && /^\d+$/.test(lastKey)) {
        current.splice(Number(lastKey), 1);
      } else {
        delete current[lastKey];
      }
    } else if (operation === 'merge' && typeof value === 'object' && value !== null) {
      current[lastKey] = { ...(current[lastKey] || {}), ...value };
    }
  }
}
