import type { IAIProvider, AIServiceGenerateOptions, AIServiceResponse } from '../types.js';
import { calculateTokenCost } from '../cost-tracker.js';

export class MockAIProvider implements IAIProvider {
  name = 'mock' as const;

  async generateText(options: AIServiceGenerateOptions<string>): Promise<AIServiceResponse<string>> {
    const startTime = Date.now();
    const responseText = `Mock AI response for prompt: ${options.prompt.slice(0, 50)}...`;
    const latency = Date.now() - startTime;
    const usage = calculateTokenCost('mock-model', 100, 50, latency);

    return {
      data: responseText,
      rawText: responseText,
      usage,
      provider: this.name,
      model: 'mock-model',
    };
  }

  async generateStructured<T>(options: AIServiceGenerateOptions<T>): Promise<AIServiceResponse<T>> {
    const startTime = Date.now();

    const sampleDesignDNA = {
      visualStyle: 'technical-developer' as const,
      density: 'medium' as const,
      cornerRadius: 'small' as const,
      typography: {
        displayFont: 'Syne, sans-serif',
        bodyFont: 'Inter, sans-serif',
        monoFont: 'JetBrains Mono, monospace',
        scaleRatio: 1.25,
      },
      motion: 'balanced' as const,
      layoutPattern: 'split-editorial' as const,
      colorMode: 'dark' as const,
      colorPalette: {
        background: '#09090B',
        surface: '#121215',
        surfaceElevated: '#18181C',
        foreground: '#FAFAFA',
        muted: '#A1A1AA',
        border: '#27272A',
        accent: '#10B981',
        accentForeground: '#042F2E',
        secondaryAccent: '#3B82F6',
      },
      accentStrategy: 'single-accent' as const,
    };

    const sampleProfile = {
      name: 'Alex Rivera',
      headline: 'Senior Full Stack & Distributed Systems Engineer',
      profession: 'Software Engineer',
      seniority: 'Senior' as const,
      industries: ['SaaS', 'Cloud Infrastructure', 'FinTech'],
      summary: 'Passionate software architect with 7+ years of experience building high-throughput microservices, realtime web apps, and AI-powered interfaces.',
      location: 'San Francisco, CA',
      email: 'alex.rivera@example.com',
      socials: {
        github: 'https://github.com/alexrivera',
        linkedin: 'https://linkedin.com/in/alexrivera',
        twitter: 'https://x.com/alexrivera',
      },
      skills: [
        { category: 'Frontend', items: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion'] },
        { category: 'Backend', items: ['Node.js', 'NestJS', 'Go', 'PostgreSQL', 'Redis', 'GraphQL'] },
        { category: 'DevOps & Cloud', items: ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Terraform'] },
      ],
      experience: [
        {
          id: 'exp-1',
          role: 'Lead Full Stack Engineer',
          company: 'Veloce Technologies',
          location: 'San Francisco, CA',
          startDate: '2022-03',
          current: true,
          description: 'Architected distributed event-driven platform handling 50M+ requests daily with 99.99% uptime.',
          highlights: ['Reduced API p95 latency by 42% through caching and query optimization', 'Mentored 8 engineers across frontend and backend squads'],
        },
        {
          id: 'exp-2',
          role: 'Senior Software Engineer',
          company: 'Aether Labs',
          location: 'Remote',
          startDate: '2019-06',
          endDate: '2022-02',
          current: false,
          description: 'Developed modern web application interfaces and resilient GraphQL backends.',
          highlights: ['Built real-time collaborative workspace used by 120k MAU', 'Pioneered design system and UI test automation suite'],
        },
      ],
      projects: [
        {
          id: 'proj-1',
          title: 'HyperStream Real-Time Analytics',
          description: 'High-throughput stream processing pipeline and real-time visualization dashboard.',
          technologies: ['React', 'TypeScript', 'Go', 'Apache Kafka', 'ClickHouse'],
          highlights: ['Sub-100ms real-time metric updates', '2,400+ GitHub Stars'],
          liveUrl: 'https://hyperstream.example.dev',
          githubUrl: 'https://github.com/alexrivera/hyperstream',
        },
        {
          id: 'proj-2',
          title: 'Nexus UI Component Library',
          description: 'Accessible, dark-mode first design system with fluid animations and keyboard navigation.',
          technologies: ['React', 'Tailwind CSS', 'Radix UI', 'Framer Motion'],
          highlights: ['WCAG 2.2 AA compliant', '15k monthly npm downloads'],
          liveUrl: 'https://nexus-ui.example.dev',
          githubUrl: 'https://github.com/alexrivera/nexus-ui',
        },
      ],
      education: [
        {
          id: 'edu-1',
          degree: 'B.S. in Computer Science',
          institution: 'University of California, Berkeley',
          startDate: '2015',
          endDate: '2019',
        },
      ],
      certifications: [
        { name: 'AWS Certified Solutions Architect', issuer: 'Amazon Web Services', date: '2023' },
      ],
      achievements: [
        { title: '1st Place Winner - Global Distributed Systems Hackathon 2023' },
      ],
      personality: ['technical', 'curious', 'builder', 'detail-oriented', 'innovative'],
      targetAudience: ['Engineering Leaders', 'Founders', 'Venture Capitalists', 'Tech Recruiters'],
      brandPositioning: 'Senior architect combining deep systems engineering with polished design craft.',
      portfolioPriority: ['projects', 'skills', 'experience', 'architecture'],
      groundedFacts: [
        { claim: 'Lead Full Stack Engineer at Veloce Technologies', source: 'resume' as const, confidence: 1.0 },
        { claim: 'B.S. in Computer Science from UC Berkeley', source: 'resume' as const, confidence: 1.0 },
      ],
    };

    const sampleEnhancedSpec = {
      originalPrompt: options.prompt,
      profession: 'Senior Full Stack & Systems Engineer',
      seniority: 'Senior' as const,
      targetAudience: ['Engineering VPs', 'Startup CTOs', 'Technical Recruiters'],
      brandPersonality: ['Precise', 'Modern', 'Authoritative', 'Minimalist', 'High-Performance'],
      visualDirection: 'Minimal Dark Technical Editorial Aesthetic with crisp monospace accents and tactile micro-motion',
      typographyDirection: 'Modern geometric display header font paired with clean neutral sans-serif body and monospace code tags',
      colorStrategy: 'Deep Obsidian (#09090B) backdrop with Charcoal (#18181B) card surfaces and Radiant Emerald (#10B981) technical accent',
      layoutGrammar: 'Split-hero with live stats counter → Curated featured projects → Interactive tech stack matrix → Timeline experience → Terminal contact drawer',
      contentPriority: ['High-impact systems metrics', 'Architecture case studies', 'Interactive technology graph', 'Career trajectory'],
      interactionPhilosophy: 'Restrained magnetic hover states, smooth progressive scroll reveals, and subtle scanline/grid backdrop depth',
      keyConversionGoal: 'Drive high-caliber technical leadership interviews and advisory collaborations within 15 seconds of viewing',
    };

    const samplePortfolio = {
      id: 'portfolio-demo-1',
      version: 1,
      userId: 'user-demo-1',
      name: 'Alex Rivera — Systems & Full Stack Engineer',
      slug: 'alex-rivera',
      status: 'DRAFT' as const,
      publishedUrl: 'https://alex-rivera.portfolio.ai',
      designDNA: sampleDesignDNA,
      seo: {
        title: 'Alex Rivera | Lead Systems & Full Stack Engineer',
        description: 'Senior software architect specializing in high-scale distributed systems, real-time web applications, and modern TypeScript architectures.',
        keywords: ['Alex Rivera', 'Full Stack Engineer', 'Distributed Systems', 'Next.js', 'React', 'Go', 'Kubernetes'],
        twitterCard: 'summary_large_image' as const,
      },
      navigation: {
        brandText: 'Alex Rivera',
        links: [
          { label: 'Work', targetSectionId: 'selected-work' },
          { label: 'Skills', targetSectionId: 'skills' },
          { label: 'Experience', targetSectionId: 'experience' },
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
          type: 'hero' as const,
          variant: 'split-editorial',
          visible: true,
          order: 0,
          title: 'Architecting Scalable Systems & Modern Experiences',
          subtitle: 'Senior Full Stack & Distributed Systems Engineer based in San Francisco, CA.',
          content: {
            badgeText: 'Available for Select Projects & Roles',
            headline: 'I design & engineer resilient distributed architectures with bespoke frontend craft.',
            description: '7+ years turning complex infrastructure challenges into elegant, high-throughput digital products.',
            primaryCta: { label: 'Explore Featured Work', targetSectionId: 'selected-work' },
            secondaryCta: { label: 'View Experience', targetSectionId: 'experience' },
            stats: [
              { label: 'Daily Requests Handled', value: '50M+' },
              { label: 'Years Experience', value: '7+' },
              { label: 'Uptime SLA', value: '99.99%' },
            ],
          },
        },
        {
          id: 'selected-work',
          type: 'selected-work' as const,
          variant: 'asymmetric-grid',
          visible: true,
          order: 1,
          title: 'Selected Engineering Projects',
          subtitle: 'Production systems, open-source tooling, and high-performance user interfaces.',
          content: {
            projects: [
              {
                id: 'proj-1',
                title: 'HyperStream Real-Time Analytics',
                description: 'High-throughput stream processing pipeline and real-time visualization dashboard.',
                technologies: ['React', 'TypeScript', 'Go', 'Apache Kafka', 'ClickHouse'],
                highlights: ['Sub-100ms real-time metric updates', '2,400+ GitHub Stars'],
                liveUrl: 'https://hyperstream.example.dev',
                githubUrl: 'https://github.com/alexrivera/hyperstream',
              },
              {
                id: 'proj-2',
                title: 'Nexus UI Component Library',
                description: 'Accessible, dark-mode first design system with fluid animations and keyboard navigation.',
                technologies: ['React', 'Tailwind CSS', 'Radix UI', 'Framer Motion'],
                highlights: ['WCAG 2.2 AA compliant', '15k monthly npm downloads'],
                liveUrl: 'https://nexus-ui.example.dev',
                githubUrl: 'https://github.com/alexrivera/nexus-ui',
              },
            ],
          },
        },
        {
          id: 'skills',
          type: 'skills' as const,
          variant: 'category-matrix',
          visible: true,
          order: 2,
          title: 'Technical Arsenal',
          subtitle: 'Core competencies across modern software architecture and web development.',
          content: {
            categories: [
              { category: 'Frontend', items: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'GraphQL'] },
              { category: 'Backend & Distributed', items: ['Node.js', 'NestJS', 'Go', 'PostgreSQL', 'Redis', 'Kafka', 'REST APIs'] },
              { category: 'Cloud & Infrastructure', items: ['Docker', 'Kubernetes', 'AWS', 'Terraform', 'CI/CD Pipelines', 'Prometheus'] },
            ],
          },
        },
        {
          id: 'experience',
          type: 'experience' as const,
          variant: 'timeline-minimal',
          visible: true,
          order: 3,
          title: 'Career History',
          subtitle: 'Track record of high-impact engineering leadership and technical execution.',
          content: {
            roles: [
              {
                role: 'Lead Full Stack Engineer',
                company: 'Veloce Technologies',
                location: 'San Francisco, CA',
                period: '2022 — Present',
                description: 'Architected distributed event-driven platform handling 50M+ requests daily with 99.99% uptime.',
                highlights: [
                  'Reduced API p95 latency by 42% through caching and query optimization',
                  'Mentored 8 engineers across frontend and backend squads',
                ],
              },
              {
                role: 'Senior Software Engineer',
                company: 'Aether Labs',
                location: 'Remote',
                period: '2019 — 2022',
                description: 'Developed modern web application interfaces and resilient GraphQL backends.',
                highlights: [
                  'Built real-time collaborative workspace used by 120k MAU',
                  'Pioneered design system and UI test automation suite',
                ],
              },
            ],
          },
        },
        {
          id: 'contact',
          type: 'contact' as const,
          variant: 'terminal-split',
          visible: true,
          order: 4,
          title: 'Initiate Contact',
          subtitle: 'Let\'s collaborate on building the next generation of resilient digital experiences.',
          content: {
            email: 'alex.rivera@example.com',
            location: 'San Francisco, CA (Open to Remote / Hybrid)',
            socials: [
              { platform: 'GitHub', url: 'https://github.com/alexrivera' },
              { platform: 'LinkedIn', url: 'https://linkedin.com/in/alexrivera' },
              { platform: 'Twitter / X', url: 'https://x.com/alexrivera' },
            ],
          },
        },
      ],
      footer: {
        copyrightText: '© 2026 Alex Rivera. Built with AI-Powered Portfolio Generator.',
        socialLinks: [
          { platform: 'GitHub', url: 'https://github.com/alexrivera' },
          { platform: 'LinkedIn', url: 'https://linkedin.com/in/alexrivera' },
        ],
        backToTopButton: true,
      },
    };

    const sampleQAResult = {
      overallScore: 94,
      breakdown: {
        visualQuality: 95,
        uxQuality: 96,
        accessibility: 93,
        contentAccuracy: 98,
        responsiveDesign: 95,
      },
      passed: true,
      issues: [
        {
          severity: 'low' as const,
          type: 'a11y' as const,
          sectionId: 'contact',
          description: 'Ensure social icon buttons have descriptive aria-labels.',
          suggestedFix: 'Added aria-label attributes for screen-reader navigation.',
        },
      ],
      autoFixApplied: true,
    };

    const sampleAIEditorPatch = {
      summary: 'Updated accent color to emerald and polished hero headline',
      operations: [
        { path: 'designDNA.colorPalette.accent', operation: 'replace' as const, value: '#10B981' },
        { path: 'sections[0].content.badgeText', operation: 'replace' as const, value: 'Open to Principal Opportunities' },
      ],
    };

    let sampleData: unknown = samplePortfolio;

    // Use schema safeParse to determine exactly matching data
    if (options.schema) {
      const candidates = [
        samplePortfolio,
        sampleDesignDNA,
        sampleEnhancedSpec,
        sampleProfile,
        sampleQAResult,
        sampleAIEditorPatch,
      ];
      for (const cand of candidates) {
        const parseRes = options.schema.safeParse(cand);
        if (parseRes.success) {
          sampleData = parseRes.data;
          break;
        }
      }
    }

    if (options.schema) {
      const validated = options.schema.parse(sampleData);
      sampleData = validated;
    }

    const latency = Date.now() - startTime;
    const usage = calculateTokenCost('mock-model', 250, 450, latency);

    return {
      data: sampleData as T,
      rawText: JSON.stringify(sampleData, null, 2),
      usage,
      provider: this.name,
      model: 'mock-model',
    };
  }
}
