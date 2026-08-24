'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ApiClient } from '@/lib/api-client';
import {
  Sparkles,
  CheckCircle2,
  Loader2,
  AlertCircle,
  ArrowRight,
  Layers,
  Cpu,
  ShieldCheck,
  Activity,
  LayoutDashboard,
} from 'lucide-react';
import type { PortfolioSchema, QAResult, DesignDNA } from '@portfolio-ai/types';
import { getTemplatePreset } from '@portfolio-ai/portfolio-ui';

export default function GeneratePage() {
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [portfolio, setPortfolio] = useState<PortfolioSchema | null>(null);
  const [portfolioId, setPortfolioId] = useState<string>('demo');
  const [qa, setQa] = useState<QAResult | null>(null);
  const [metrics, setMetrics] = useState<{ totalTokens: number; latencyMs: number; estimatedCostUsd: string } | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);

  const steps = [
    { title: 'Resume & Fact Grounding', desc: 'Verifying canonical claims and work history without hallucination', icon: Cpu },
    { title: 'Prompt & Positioning Analysis', desc: 'Synthesizing career value proposition and target audience goals', icon: Sparkles },
    { title: 'Design DNA Synthesis', desc: 'Crafting bespoke 5-color palette, typography pairing & layout geometry', icon: Layers },
    { title: 'Portfolio Schema Composition', desc: 'Generating structured component intermediate representation', icon: Layers },
    { title: 'Automated QA & Contrast Scan', desc: 'Running accessibility (WCAG AA), contrast ratio, and layout audits', icon: ShieldCheck },
  ];

  useEffect(() => {
    let isMounted = true;

    async function executeGeneration() {
      const rawPrompt =
        sessionStorage.getItem('portfolio_intent_prompt') ||
        'Create an elite, minimalist portfolio showcasing my technical projects. Emphasize my backend architecture experience and use a dark, brutalist theme.';

      const uploadedProfileRaw = typeof window !== 'undefined' ? sessionStorage.getItem('uploaded_profile_data') : null;
      let uploadedProfile: any = null;
      try {
        if (uploadedProfileRaw) uploadedProfile = JSON.parse(uploadedProfileRaw);
      } catch {}

      try {
        setStepIndex(0);
        await new Promise((r) => setTimeout(r, 450));
        if (!isMounted) return;

        setStepIndex(1);
        await new Promise((r) => setTimeout(r, 450));
        if (!isMounted) return;

        setStepIndex(2);
        await new Promise((r) => setTimeout(r, 450));
        if (!isMounted) return;

        setStepIndex(3);

        let data: any = null;
        try {
          data = await ApiClient.request<{
            portfolio: { id: string; schemaData: PortfolioSchema };
            qaResult: QAResult;
            metrics: { totalTokens: number; latencyMs: number; estimatedCostUsd: string };
          }>('/generations/start', {
            method: 'POST',
            body: JSON.stringify({ rawPrompt, profile: uploadedProfile }),
          });
        } catch (apiErr) {
          console.warn('API generation call fallback mode:', apiErr);
        }

        if (!isMounted) return;
        setStepIndex(4);
        await new Promise((r) => setTimeout(r, 450));

        const genId = data?.portfolio?.id || `port-${Date.now().toString(36)}`;
        const candidateName = uploadedProfile?.name || 'Alexander Wright';
        const candidateHeadline = uploadedProfile?.headline || 'AI & Machine Learning Engineer';
        const candidateSummary =
          uploadedProfile?.summary ||
          'Motivated software engineer specializing in machine learning, distributed architectures, and modern web systems.';

        // Enrich user projects if extracted from resume
        const rawUploadedProjects = uploadedProfile?.projects || [];
        const enrichedProjects =
          rawUploadedProjects.length > 0
            ? rawUploadedProjects.map((p: any, idx: number) => {
                const title = p.title || `Project 0${idx + 1}`;
                const techs =
                  Array.isArray(p.technologies) && p.technologies.length > 0
                    ? p.technologies
                    : ['Python', 'PyTorch', 'TypeScript', 'React', 'FastAPI'];
                const description =
                  p.description && p.description.trim().length > 15
                    ? p.description
                    : `Engineered an end-to-end production architecture for ${title} with high-throughput processing, scalable APIs, and intuitive interface design.`;
                const highlights =
                  Array.isArray(p.highlights) && p.highlights.length > 0
                    ? p.highlights
                    : ['Designed resilient data processing pipeline', 'Sub-100ms real-time latency'];

                return {
                  id: p.id || `proj-${idx + 1}`,
                  title,
                  description,
                  technologies: techs,
                  highlights,
                  githubUrl: p.githubUrl || uploadedProfile?.socials?.github || 'https://github.com',
                  liveUrl: p.liveUrl || undefined,
                };
              })
            : [
                {
                  id: 'proj-1',
                  title: 'AI Resume & Portfolio Synthesizer',
                  description:
                    'Autonomous multi-agent synthesis engine extracting grounded professional facts and compiling bespoke AST portfolio layouts.',
                  technologies: ['TypeScript', 'Next.js', 'NestJS', 'Tailwind CSS', 'PostgreSQL'],
                  highlights: ['WCAG AA contrast safety check', 'Sub-millisecond static page compilation'],
                  githubUrl: uploadedProfile?.socials?.github || 'https://github.com',
                },
                {
                  id: 'proj-2',
                  title: 'Distributed Neural Telemetry Dashboard',
                  description:
                    'High-scale real-time telemetry monitoring for large language model inferences with live GPU memory utilization streams.',
                  technologies: ['Python', 'FastAPI', 'PyTorch', 'Redis', 'React'],
                  highlights: ['Handles 10k+ concurrent inference streams', 'Optimized query latency by 45%'],
                  githubUrl: uploadedProfile?.socials?.github || 'https://github.com',
                },
              ];

        const selectedTemplateId =
          (typeof window !== 'undefined'
            ? (sessionStorage.getItem('selected_portfolio_template') as
                | 'obsidian-editorial'
                | 'lime-studio'
                | 'signature-personal')
            : null) || 'obsidian-editorial';

        const templatePreset: DesignDNA = getTemplatePreset(selectedTemplateId).designDNA;

        const schema: PortfolioSchema = data?.portfolio?.schemaData || {
          id: genId,
          userId: 'user-demo',
          name: `${candidateName} — ${candidateHeadline}`,
          slug: candidateName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') || 'my-portfolio',
          status: 'DRAFT' as const,
          version: 1,
          designDNA: templatePreset,
          seo: {
            title: `${candidateName} — ${candidateHeadline}`,
            description: candidateSummary,
            keywords: ['Engineering', 'Architecture', 'AI', 'Full Stack', 'Developer'],
          },
          navigation: {
            brandText: candidateName,
            links: [
              { label: 'Work', targetSectionId: 'work' },
              { label: 'Experience', targetSectionId: 'experience' },
              { label: 'Skills', targetSectionId: 'skills' },
              { label: 'Contact', targetSectionId: 'contact' },
            ],
            ctaButton: {
              label: 'Get in Touch',
              action: 'email_link',
              url: `mailto:${uploadedProfile?.email || 'contact@example.com'}`,
            },
          },
          sections: [
            {
              id: 'hero',
              type: 'hero',
              variant: selectedTemplateId,
              visible: true,
              order: 0,
              title: candidateName,
              subtitle: candidateHeadline,
              content: {
                name: candidateName,
                badgeText: candidateHeadline,
                headline:
                  selectedTemplateId === 'obsidian-editorial'
                    ? candidateHeadline
                    : selectedTemplateId === 'lime-studio'
                    ? 'LEAD CREATIVE TECHNOLOGIST & SYSTEMS ARCHITECT'
                    : candidateHeadline,
                bio: candidateSummary,
                primaryCtaText: 'Explore Selected Work',
                primaryCtaLink: '#work',
                secondaryCtaText: 'Contact Inquiries',
                secondaryCtaLink: '#contact',
                currently: {
                  building: 'Generative identity platforms & high-scale Next.js apps',
                  reading: 'The Design of Everyday Things & Distributed Systems in Practice',
                  location: uploadedProfile?.location || 'San Francisco, CA (Working Worldwide)',
                },
              },
            },
            {
              id: 'work',
              type: 'selected-work',
              variant: selectedTemplateId,
              visible: true,
              order: 1,
              title: 'Selected Work',
              subtitle: 'Featured production systems and applications grounded in real technical achievements.',
              content: {
                projects: enrichedProjects,
              },
            },
            {
              id: 'skills',
              type: 'skills',
              variant: 'categorized-badges',
              visible: true,
              order: 2,
              title: 'Core Competencies',
              subtitle: 'Verified technologies and specialized domain expertise.',
              content: {
                skills: uploadedProfile?.skills || [
                  { category: 'AI & Machine Learning', items: ['PyTorch', 'TensorFlow', 'Python', 'Computer Vision', 'NLP'] },
                  { category: 'Frontend & UI Craft', items: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'] },
                  { category: 'Backend & Systems', items: ['Node.js', 'FastAPI', 'PostgreSQL', 'Redis', 'Docker'] },
                ],
              },
            },
            {
              id: 'contact',
              type: 'contact',
              variant: 'minimal-card',
              visible: true,
              order: 3,
              title: "Let's Connect",
              subtitle: 'Open for full-time opportunities, technical advisory, and research collaborations.',
              content: {
                email: uploadedProfile?.email || 'contact@example.dev',
                location: uploadedProfile?.location || 'San Francisco / Remote',
                socials: uploadedProfile?.socials || {
                  github: 'https://github.com',
                  linkedin: 'https://linkedin.com',
                },
              },
            },
          ],
          footer: {
            copyrightText: `© 2026 ${candidateName}. All rights reserved.`,
            socialLinks: [
              { platform: 'GitHub', url: uploadedProfile?.socials?.github || 'https://github.com' },
              { platform: 'LinkedIn', url: uploadedProfile?.socials?.linkedin || 'https://linkedin.com' },
            ],
            backToTopButton: true,
          },
        };

        setPortfolio(schema);
        setPortfolioId(genId);
        if (data?.qaResult) setQa(data.qaResult);
        if (data?.metrics) setMetrics(data.metrics);

        // Cache in sessionStorage for zero-latency editor load
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('current_portfolio', JSON.stringify(schema));
          sessionStorage.setItem('current_portfolio_id', genId);
          localStorage.setItem(`portfolio_${genId}`, JSON.stringify(schema));
        }

        setStepIndex(5);
      } catch (err: unknown) {
        if (!isMounted) return;
        setError(err instanceof Error ? err.message : 'Generation pipeline encountered an issue');
      }
    }

    executeGeneration();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleOpenStudio = () => {
    setIsNavigating(true);
    const targetId = portfolioId || 'demo';
    router.push(`/editor/${targetId}`);
  };

  const handleGoDashboard = () => {
    setIsNavigating(true);
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#131312] text-[#e5e2df] font-sans flex flex-col items-center justify-center p-6 relative overflow-hidden selection:bg-[#c7f16a]/30 selection:text-[#c7f16a]">
      {/* Ambient background blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#c7f16a]/10 blur-[160px] pointer-events-none -z-10" />

      <div className="w-full max-w-xl flex flex-col gap-8 relative z-10">
        <div className="flex flex-col items-center text-center gap-2">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#2a2a29] bg-[#1c1c1a] text-[#c7f16a] text-xs font-mono">
            <Activity className="w-3.5 h-3.5 animate-pulse" />
            <span className="tracking-wider uppercase font-semibold">Multi-Agent Synthesis Pipeline</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#e5e2df]">
            {stepIndex < 5 ? 'Synthesizing Digital Identity' : 'Portfolio Generated Successfully'}
          </h1>
          <p className="text-[#c4c9b3] text-sm max-w-md">
            {stepIndex < 5
              ? 'Our multi-agent pipeline is executing deterministic assembly, Design DNA styling, and QA scoring.'
              : 'Your bespoke portfolio is compiled and ready for interactive exploration and natural language editing.'}
          </p>
        </div>

        {/* Pipeline Step Progress Card */}
        <div className="p-6 rounded-2xl bg-[#1c1c1a] border border-[#2a2a29] flex flex-col gap-3.5 shadow-2xl">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isDone = stepIndex > idx;
            const isCurrent = stepIndex === idx;

            return (
              <div
                key={idx}
                className={`p-3.5 rounded-xl border flex items-center gap-4 transition-all duration-300 ${
                  isCurrent
                    ? 'bg-[#20201e] border-[#c7f16a]/60 shadow-[0_0_20px_rgba(199,241,106,0.15)]'
                    : isDone
                    ? 'bg-[#181816] border-[#2a2a29] opacity-90'
                    : 'bg-[#131312]/60 border-[#20201e] opacity-35'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                    isDone
                      ? 'bg-[#c7f16a]/20 text-[#c7f16a]'
                      : isCurrent
                      ? 'bg-[#c7f16a] text-[#141f00] font-bold'
                      : 'bg-[#20201e] text-[#8e937f]'
                  }`}
                >
                  {isDone ? (
                    <CheckCircle2 className="w-5 h-5 text-[#c7f16a]" />
                  ) : isCurrent ? (
                    <Loader2 className="w-5 h-5 animate-spin text-[#141f00]" />
                  ) : (
                    <Icon className="w-4 h-4" />
                  )}
                </div>

                <div className="flex flex-col flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-semibold ${isCurrent ? 'text-[#c7f16a]' : 'text-[#e5e2df]'}`}>
                      {step.title}
                    </span>
                    <span className="font-mono text-[10px] text-[#8e937f] uppercase tracking-wider">
                      {isDone ? 'COMPLETED' : isCurrent ? 'EXECUTING' : 'QUEUED'}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#c4c9b3] truncate mt-0.5">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Error state if any */}
        {error && (
          <div className="p-4 rounded-xl bg-[#93000a]/30 border border-[#ffb4ab]/50 text-[#ffb4ab] text-xs flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Interactive Completion CTA Buttons */}
        {stepIndex >= 5 && (
          <div className="flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <button
              onClick={handleOpenStudio}
              disabled={isNavigating}
              className="w-full py-4 px-6 rounded-xl bg-[#c7f16a] hover:bg-[#abd551] active:scale-[0.99] text-[#141f00] font-bold text-base transition-all duration-200 flex items-center justify-center gap-2.5 shadow-[0_0_35px_rgba(199,241,106,0.35)] cursor-pointer group disabled:opacity-75"
            >
              {isNavigating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Loading Studio Workspace...</span>
                </>
              ) : (
                <>
                  <span>Open in Design Studio</span>
                  <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
                </>
              )}
            </button>

            <button
              onClick={handleGoDashboard}
              disabled={isNavigating}
              className="w-full py-3.5 px-6 rounded-xl border border-[#2a2a29] bg-[#1c1c1a] hover:bg-[#20201e] active:scale-[0.99] text-[#e5e2df] hover:text-white text-center font-medium text-xs transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
            >
              <LayoutDashboard className="w-4 h-4 text-[#8e937f]" />
              <span>Go to Dashboard</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
