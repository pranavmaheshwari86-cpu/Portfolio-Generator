import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { getDatabase, portfolios, portfolioVersions, deployments } from '@portfolio-ai/database';
import { eq, and, desc } from 'drizzle-orm';
import type { PortfolioSchema } from '@portfolio-ai/types';
import { MemoryStore } from '../common/memory-store.js';

@Injectable()
export class PortfoliosService {
  private db = getDatabase();

  async createPortfolio(userId: string, schema: PortfolioSchema) {
    let baseSlug = schema.slug.toLowerCase().replace(/[^a-z0-9-]/g, '-');
    if (!baseSlug) baseSlug = `portfolio-${Date.now().toString(36)}`;

    let slug = baseSlug;
    schema.slug = slug;
    schema.userId = userId;
    const portfolioId = schema.id || `port-${Date.now().toString(36)}`;
    schema.id = portfolioId;

    const memRecord = {
      id: portfolioId,
      userId,
      name: schema.name,
      slug,
      status: 'DRAFT' as const,
      version: 1,
      designDNA: schema.designDNA,
      schemaData: schema,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    MemoryStore.portfolios.set(portfolioId, memRecord);

    try {
      const [record] = await this.db
        .insert(portfolios)
        .values({
          userId,
          name: schema.name,
          slug,
          status: 'DRAFT',
          version: 1,
          designDNA: schema.designDNA,
          schemaData: schema,
        })
        .returning();

      if (record) return { ...record, schemaData: schema };
    } catch {}

    return memRecord;
  }

  async getUserPortfolios(userId: string) {
    try {
      const res = await this.db
        .select()
        .from(portfolios)
        .where(eq(portfolios.userId, userId))
        .orderBy(desc(portfolios.updatedAt));
      if (res && res.length > 0) return res;
    } catch {}

    return Array.from(MemoryStore.portfolios.values()).filter((p) => p.userId === userId);
  }

  async getPortfolioById(userId: string, id: string) {
    try {
      const [record] = await this.db
        .select()
        .from(portfolios)
        .where(eq(portfolios.id, id))
        .limit(1);

      if (record) {
        if (record.userId !== userId) throw new ForbiddenException('You do not have access to this portfolio');
        return record;
      }
    } catch (err) {
      if (err instanceof ForbiddenException) throw err;
    }

    let mem = MemoryStore.portfolios.get(id);
    if (!mem && (id === 'portfolio-demo-1' || id.startsWith('portfolio-demo') || id.startsWith('demo'))) {
      const demoSchema = this.getDemoPortfolio(id, userId);
      const demoRecord = {
        id,
        userId,
        name: demoSchema.name,
        slug: demoSchema.slug,
        status: 'DRAFT' as const,
        version: 1,
        designDNA: demoSchema.designDNA,
        schemaData: demoSchema,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      MemoryStore.portfolios.set(id, demoRecord);
      mem = demoRecord;
    }

    if (!mem) throw new NotFoundException('Portfolio not found');
    return mem;
  }

  private getDemoPortfolio(id = 'portfolio-demo-1', userId = 'guest-user-session'): PortfolioSchema {
    return {
      id,
      version: 1,
      userId,
      name: 'Alexander Wright — Staff AI Systems Architect',
      slug: 'alexander-wright',
      status: 'DRAFT',
      designDNA: {
        visualStyle: 'technical-developer',
        density: 'medium',
        cornerRadius: 'medium',
        motion: 'balanced',
        layoutPattern: 'modular-cards',
        colorMode: 'dark',
        colorPalette: {
          background: '#030712',
          surface: '#09090B',
          surfaceElevated: '#18181B',
          foreground: '#F9FAFB',
          muted: '#9CA3AF',
          border: 'rgba(255,255,255,0.08)',
          accent: '#10B981',
          accentForeground: '#000000',
          secondaryAccent: '#3B82F6',
        },
        typography: {
          displayFont: 'Outfit',
          bodyFont: 'Inter',
          monoFont: 'JetBrains Mono',
          scaleRatio: 1.25,
        },
        accentStrategy: 'subtle-glow',
      },
      seo: {
        title: 'Alexander Wright | Staff AI Systems Architect',
        description: 'Portfolio of Alexander Wright - 8+ years building enterprise generative AI systems and distributed infrastructure.',
        keywords: ['AI Engineer', 'Machine Learning', 'Next.js', 'Distributed Systems', 'TypeScript', 'Python'],
        twitterCard: 'summary_large_image',
      },
      navigation: {
        brandText: 'Alexander Wright',
        links: [
          { label: 'Work', targetSectionId: 'selected-work' },
          { label: 'Experience', targetSectionId: 'experience' },
          { label: 'Skills', targetSectionId: 'skills' },
          { label: 'Contact', targetSectionId: 'contact' },
        ],
        ctaButton: {
          label: 'Get in Touch',
          action: 'contact_modal',
        },
      },
      sections: [
        {
          id: 'hero',
          type: 'hero',
          variant: 'minimal-centered',
          visible: true,
          order: 0,
          title: 'Alexander Wright',
          subtitle: 'Staff AI Systems Architect',
          content: {
            title: 'Alexander Wright',
            subtitle: 'Staff AI Systems Architect & Research Engineer',
            bio: 'Pioneering production-scale generative AI infrastructure, low-latency model serving, and resilient distributed platforms.',
            primaryCta: { label: 'Explore Selected Work', href: '#selected-work' },
            secondaryCta: { label: 'Read Architecture Notes', href: '#experience' },
          },
        },
        {
          id: 'selected-work',
          type: 'selected-work',
          variant: 'interactive-cards',
          visible: true,
          order: 1,
          title: 'Featured Deployments',
          subtitle: 'Production systems designed for extreme throughput and sub-millisecond precision.',
          content: {
            projects: [
              {
                title: 'NeuralFlux Gateway',
                description: 'Real-time multi-agent routing and inference proxy processing 12,000 req/s with dynamic fallback.',
                tags: ['Rust', 'gRPC', 'WebAssembly', 'OpenAI API'],
                metrics: '12K req/sec · 99.99% SLA · <8ms p99',
                link: 'https://github.com',
              },
              {
                title: 'VectorFlow Engine',
                description: 'Distributed vector search and hybrid indexing substrate across 100M+ high-dimensional embeddings.',
                tags: ['Python', 'C++', 'HNSW', 'Next.js'],
                metrics: '100M+ vectors · 4ms retrieval',
                link: 'https://github.com',
              },
            ],
          },
        },
        {
          id: 'skills',
          type: 'skills',
          variant: 'bento-grid',
          visible: true,
          order: 2,
          title: 'Core Competencies',
          subtitle: 'Deep technical capabilities across the entire intelligent stack.',
          content: {
            categories: [
              {
                name: 'Generative AI & LLMs',
                skills: ['LangChain', 'LlamaIndex', 'RAG Pipelines', 'Fine-Tuning (LoRA)', 'Prompt Optimization', 'Semantic Caching'],
              },
              {
                name: 'Distributed Systems & Cloud',
                skills: ['TypeScript / Node.js', 'Go / Rust', 'PostgreSQL / pgvector', 'Redis Streams', 'Docker / K8s', 'Kafka'],
              },
              {
                name: 'Frontend & Experience',
                skills: ['Next.js 15', 'React 19', 'Tailwind CSS', 'Framer Motion', 'Canvas / WebGL', 'Three.js'],
              },
            ],
          },
        },
        {
          id: 'experience',
          type: 'experience',
          variant: 'timeline',
          visible: true,
          order: 3,
          title: 'Work Experience',
          subtitle: 'Leadership roles accelerating high-growth engineering teams.',
          content: {
            items: [
              {
                role: 'Staff AI Engineer',
                company: 'Synthetix Cloud',
                period: '2023 — Present',
                description: 'Led the foundation infrastructure team building model distillation, automatic prompt compilation, and multi-tenant agent execution engines.',
              },
              {
                role: 'Senior Distributed Systems Architect',
                company: 'Vanguard Data Systems',
                period: '2020 — 2023',
                description: 'Architected event-driven data ingestion platform processing 250M events daily with zero data loss.',
              },
            ],
          },
        },
        {
          id: 'contact',
          type: 'contact',
          variant: 'card',
          visible: true,
          order: 4,
          title: 'Initiate Collaboration',
          subtitle: 'Open for advisory roles, executive engineering consulting, and breakthrough AI systems.',
          content: {
            email: 'alexander@wright-ai.dev',
            location: 'San Francisco, CA & Remote',
          },
        },
      ],
      footer: {
        copyrightText: '© 2026 Alexander Wright. All rights reserved.',
        socialLinks: [
          { platform: 'GitHub', url: 'https://github.com' },
          { platform: 'LinkedIn', url: 'https://linkedin.com' },
          { platform: 'X', url: 'https://x.com' },
        ],
        backToTopButton: true,
      },
    };
  }

  async getPortfolioBySlug(slug: string) {
    try {
      const [record] = await this.db
        .select()
        .from(portfolios)
        .where(eq(portfolios.slug, slug))
        .limit(1);

      if (record) return record;
    } catch {}

    for (const mem of MemoryStore.portfolios.values()) {
      if (mem.slug === slug) return mem;
    }

    throw new NotFoundException('Portfolio not found');
  }

  async updatePortfolio(userId: string, id: string, updatedSchema: PortfolioSchema, changeSummary = 'Editor update') {
    const record = await this.getPortfolioById(userId, id);
    const nextVersion = (record.version || 1) + 1;
    updatedSchema.version = nextVersion;

    const mem = MemoryStore.portfolios.get(id);
    if (mem) {
      mem.name = updatedSchema.name;
      mem.designDNA = updatedSchema.designDNA;
      mem.schemaData = updatedSchema;
      mem.version = nextVersion;
      mem.updatedAt = new Date();
    }

    try {
      const [updated] = await this.db
        .update(portfolios)
        .set({
          name: updatedSchema.name,
          designDNA: updatedSchema.designDNA,
          schemaData: updatedSchema,
          version: nextVersion,
          updatedAt: new Date(),
        })
        .where(and(eq(portfolios.id, id), eq(portfolios.userId, userId)))
        .returning();

      if (updated) return updated;
    } catch {}

    return mem || record;
  }

  async publishPortfolio(userId: string, id: string) {
    const record = await this.getPortfolioById(userId, id);
    const publishedUrl = `http://localhost:3000/p/${record.slug}`;

    const mem = MemoryStore.portfolios.get(id);
    if (mem) {
      mem.status = 'PUBLISHED';
      mem.publishedUrl = publishedUrl;
      mem.updatedAt = new Date();
    }

    try {
      const [updated] = await this.db
        .update(portfolios)
        .set({
          status: 'PUBLISHED',
          publishedUrl,
          updatedAt: new Date(),
        })
        .where(eq(portfolios.id, id))
        .returning();

      if (updated) return updated;
    } catch {}

    return { ...record, status: 'PUBLISHED', publishedUrl };
  }

  async getVersions(userId: string, portfolioId: string) {
    await this.getPortfolioById(userId, portfolioId);

    try {
      return await this.db
        .select()
        .from(portfolioVersions)
        .where(eq(portfolioVersions.portfolioId, portfolioId))
        .orderBy(desc(portfolioVersions.versionNumber));
    } catch {
      const mem = MemoryStore.portfolios.get(portfolioId);
      return mem ? [{ versionNumber: mem.version, changeSummary: 'Latest', createdAt: new Date() }] : [];
    }
  }
}
