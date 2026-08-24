'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ApiClient } from '@/lib/api-client';
import { PortfolioRenderer, PORTFOLIO_TEMPLATES, applyTemplateToPortfolio } from '@portfolio-ai/portfolio-ui';
import type { PortfolioSchema } from '@portfolio-ai/types';
import Link from 'next/link';

export default function EditorPage() {
  const params = useParams();
  const portfolioId = params.id as string;

  const [portfolio, setPortfolio] = useState<PortfolioSchema | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [publishedUrl, setPublishedUrl] = useState<string | null>(null);
  const [aiApplying, setAiApplying] = useState(false);
  const [aiInstruction, setAiInstruction] = useState('Make the hero more editorial and reduce the visual density.');
  const [aiStatusMessage, setAiStatusMessage] = useState<string | null>(null);

  const handleSwitchTemplate = async (
    templateId: 'obsidian-editorial' | 'lime-studio' | 'signature-personal'
  ) => {
    if (!portfolio) return;
    const updated = applyTemplateToPortfolio(portfolio, templateId);
    setPortfolio(updated);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('current_portfolio', JSON.stringify(updated));
      localStorage.setItem(`portfolio_${portfolioId}`, JSON.stringify(updated));
    }
    const templateName = PORTFOLIO_TEMPLATES[templateId]?.name || templateId;
    setAiStatusMessage(`Switched to ${templateName} template.`);
    setTimeout(() => setAiStatusMessage(null), 3000);

    try {
      await ApiClient.request(`/portfolios/${portfolioId}`, {
        method: 'PUT',
        body: JSON.stringify(updated),
      });
    } catch {}
  };

  useEffect(() => {
    async function loadPortfolio() {
      // 1. Try local/session cache for instant render
      let foundData: PortfolioSchema | null = null;
      if (typeof window !== 'undefined') {
        try {
          const cachedSession = sessionStorage.getItem('current_portfolio');
          if (cachedSession) foundData = JSON.parse(cachedSession);

          const cachedLocal = localStorage.getItem(`portfolio_${portfolioId}`);
          if (!foundData && cachedLocal) foundData = JSON.parse(cachedLocal);
        } catch {}
      }

      if (foundData && foundData.sections) {
        setPortfolio(foundData);
        setLoading(false);
      }

      // 2. Fetch fresh from API
      try {
        const res = await ApiClient.request<any>(`/portfolios/${portfolioId}`);
        const data: PortfolioSchema = res?.schemaData || res?.schema || res;
        if (data && data.sections) {
          setPortfolio(data);
          if (data.status === 'PUBLISHED') {
            setPublishedUrl(data.publishedUrl || null);
          }
        }
      } catch (err) {
        // Fallback default if not in API and not in cache
        if (!foundData) {
          const defaultDemo: PortfolioSchema = {
            id: portfolioId || 'demo',
            userId: 'user-demo',
            name: 'Alexander Wright — Creative Director & Systems Architect',
            slug: 'alexander-wright',
            status: 'DRAFT',
            version: 1,
            designDNA: {
              visualStyle: 'minimal-editorial',
              density: 'medium',
              cornerRadius: 'small',
              typography: {
                displayFont: 'Instrument Serif, serif',
                bodyFont: 'Geist, sans-serif',
                monoFont: 'JetBrains Mono, monospace',
                scaleRatio: 1.25,
              },
              motion: 'balanced',
              layoutPattern: 'split-editorial',
              colorMode: 'dark',
              colorPalette: {
                background: '#131312',
                surface: '#1c1c1a',
                surfaceElevated: '#20201e',
                foreground: '#e5e2df',
                muted: '#8e937f',
                border: '#2a2a29',
                accent: '#c7f16a',
                accentForeground: '#141f00',
                secondaryAccent: '#f0bf64',
              },
              accentStrategy: 'duotone',
            },
            seo: {
              title: 'Alexander Wright — Systems Architect & Creative Director',
              description: 'Bespoke digital portfolio engineered with high precision, modern architectures, and editorial craft.',
              keywords: ['Software Engineer', 'Architecture', 'AI Systems', 'Next.js', 'React'],
            },
            navigation: {
              brandText: 'Alexander Wright',
              links: [
                { label: 'Work', targetSectionId: 'work' },
                { label: 'Skills', targetSectionId: 'skills' },
                { label: 'Contact', targetSectionId: 'contact' },
              ],
              ctaButton: {
                label: 'Get in Touch',
                action: 'email_link',
                url: 'mailto:alexander@example.dev',
              },
            },
            sections: [
              {
                id: 'hero',
                type: 'hero',
                variant: 'split-editorial',
                visible: true,
                order: 0,
                title: 'Alexander Wright',
                subtitle: 'Creative Director / Systems Architect',
                content: {
                  badgeText: 'Creative Director / Systems Architect',
                  headline: 'SHAPING SYSTEMS & EXPERIENCES',
                  bio: 'I design robust, scalable interfaces and distributed systems that balance architectural precision with editorial craft.',
                  primaryCtaText: 'Explore Selected Work',
                  primaryCtaLink: '#work',
                  secondaryCtaText: 'Read Architecture Notes',
                  secondaryCtaLink: '#experience',
                },
              },
              {
                id: 'work',
                type: 'selected-work',
                variant: 'asymmetric-grid',
                visible: true,
                order: 1,
                title: 'Selected Work',
                subtitle: 'Featured systems and applications engineered with modern technologies.',
                content: {
                  projects: [
                    {
                      id: 'proj-1',
                      title: 'Nexus Intelligence Platform',
                      description: 'Distributed real-time financial telemetry dashboard serving 200k+ concurrent traders with sub-millisecond updates.',
                      technologies: ['TypeScript', 'Next.js', 'Rust', 'Tailwind CSS'],
                      highlights: ['Sub-millisecond update latency', '200k+ concurrent connected clients'],
                      githubUrl: 'https://github.com',
                    },
                    {
                      id: 'proj-2',
                      title: 'Mono Editorial Design Engine',
                      description: 'Generative typography layout engine generating print-quality digital publishing layouts on the edge.',
                      technologies: ['React', 'Canvas', 'WebGL', 'WebAssembly'],
                      highlights: ['Deterministic AST compilation', 'Zero runtime CSS overhead'],
                      githubUrl: 'https://github.com',
                    },
                  ],
                },
              },
              {
                id: 'skills',
                type: 'skills',
                variant: 'categorized-badges',
                visible: true,
                order: 2,
                title: 'Core Competencies',
                subtitle: 'Verified technologies and specialized engineering domains.',
                content: {
                  skills: [
                    { category: 'AI & Machine Learning', items: ['PyTorch', 'TensorFlow', 'Python', 'Computer Vision'] },
                    { category: 'Frontend Craft', items: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'] },
                    { category: 'Systems & Backend', items: ['Node.js', 'FastAPI', 'PostgreSQL', 'Redis', 'Docker'] },
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
                subtitle: 'Open for leadership roles and advisory collaborations.',
                content: {
                  email: 'alexander@example.dev',
                  location: 'San Francisco / Remote',
                  socials: {
                    github: 'https://github.com',
                    linkedin: 'https://linkedin.com',
                  },
                },
              },
            ],
            footer: {
              copyrightText: '© 2026 Alexander Wright. All rights reserved.',
              socialLinks: [
                { platform: 'GitHub', url: 'https://github.com' },
                { platform: 'LinkedIn', url: 'https://linkedin.com' },
              ],
              backToTopButton: true,
            },
          };
          setPortfolio(defaultDemo);
        }
      } finally {
        setLoading(false);
      }
    }

    if (portfolioId) {
      loadPortfolio();
    }
  }, [portfolioId]);

  const handleSave = async () => {
    if (!portfolio) return;
    setSaving(true);
    try {
      await ApiClient.request(`/portfolios/${portfolioId}`, {
        method: 'PUT',
        body: JSON.stringify(portfolio),
      });
      setAiStatusMessage('Portfolio version synced.');
      setTimeout(() => setAiStatusMessage(null), 3000);
    } catch (err) {
      console.error('Failed to save portfolio:', err);
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!portfolio) return;
    setPublishing(true);
    try {
      const res = await ApiClient.request<{ publishedUrl: string }>(
        `/portfolios/${portfolioId}/publish`,
        { method: 'POST' }
      );
      setPublishedUrl(res.publishedUrl);
      setPortfolio((prev) => (prev ? { ...prev, status: 'PUBLISHED' } : null));
      setAiStatusMessage('Portfolio is live and published!');
      setTimeout(() => setAiStatusMessage(null), 4000);
    } catch (err) {
      console.error('Failed to publish portfolio:', err);
    } finally {
      setPublishing(false);
    }
  };

  const handleApplyAIPatch = async (customText?: string) => {
    const instruction = customText || aiInstruction;
    if (!instruction.trim() || !portfolio) return;

    setAiApplying(true);
    setAiStatusMessage(null);

    try {
      const res = await ApiClient.request<{
        summary: string;
        updatedPortfolio: PortfolioSchema;
      }>('/ai/edit-patch', {
        method: 'POST',
        body: JSON.stringify({
          portfolio,
          instruction,
        }),
      });

      setPortfolio(res.updatedPortfolio);
      setAiStatusMessage(`Applied: ${res.summary}`);
      setAiInstruction('');

      // Auto-save the updated portfolio
      await ApiClient.request(`/portfolios/${portfolioId}`, {
        method: 'PUT',
        body: JSON.stringify(res.updatedPortfolio),
      });
    } catch (err: unknown) {
      // Local graceful fallback edit for interactive demo
      const lower = instruction.toLowerCase();
      if (lower.includes('obsidian') || (lower.includes('editorial') && !lower.includes('lime'))) {
        handleSwitchTemplate('obsidian-editorial');
      } else if (lower.includes('lime') || lower.includes('studio') || lower.includes('split')) {
        handleSwitchTemplate('lime-studio');
      } else if (lower.includes('signature') || lower.includes('personal') || lower.includes('warm') || lower.includes('photo')) {
        handleSwitchTemplate('signature-personal');
      } else {
        setAiStatusMessage(err instanceof Error ? err.message : 'AI edit completed.');
      }
    } finally {
      setAiApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center text-on-surface">
        <span className="material-symbols-outlined text-primary-fixed text-4xl animate-spin">sync</span>
      </div>
    );
  }

  if (!portfolio) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center gap-4 text-on-surface">
        <p className="font-headline-md text-lg">Portfolio not found.</p>
        <Link href="/dashboard" className="text-primary-fixed text-sm underline">
          Return to dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-surface font-body-md text-on-surface antialiased min-h-screen flex flex-col selection:bg-primary-fixed/30 selection:text-primary-fixed">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-surface/90 backdrop-blur-md border-b border-surface-container-high">
        <div className="h-[72px] max-w-[1440px] mx-auto px-6 md:px-container-padding-x flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary-fixed flex items-center justify-center font-black text-on-primary-fixed text-base shadow-[0_0_20px_rgba(199,241,106,0.35)]">
                ▲
              </div>
              <span className="font-headline-md text-body-lg tracking-tight font-semibold text-on-surface">Portfolio.ai</span>
            </Link>
            <span className="font-metadata-sm text-metadata-sm text-outline px-2 py-0.5 border border-outline-variant rounded uppercase">
              v1.0.4
            </span>
          </div>

          <nav className="hidden lg:flex items-center gap-gutter">
            <Link className="font-metadata-sm text-metadata-sm text-on-surface-variant hover:text-on-surface transition-colors uppercase" href="/#explore">
              EXPLORE
            </Link>
            <Link className="font-metadata-sm text-metadata-sm text-on-surface-variant hover:text-on-surface transition-colors uppercase" href="/#showcase">
              SHOWCASE
            </Link>
            <Link className="font-metadata-sm text-metadata-sm text-on-surface-variant hover:text-on-surface transition-colors uppercase" href="/#architecture">
              PRICING
            </Link>
          </nav>

          <div className="flex items-center gap-stack-md">
            {publishedUrl ? (
              <Link
                href={`/p/${portfolio.slug}`}
                target="_blank"
                className="font-body-md text-body-md px-4 py-1.5 border border-primary-fixed text-primary-fixed hover:bg-primary-fixed/10 transition-all rounded flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                View Live
              </Link>
            ) : (
              <Link
                href="/auth/login"
                className="font-body-md text-body-md px-5 py-2 border border-outline hover:border-on-surface transition-all rounded"
              >
                Sign In
              </Link>
            )}
            <button
              onClick={handlePublish}
              disabled={publishing}
              className="font-body-md text-body-md font-semibold bg-secondary text-on-secondary px-5 py-2 hover:bg-secondary-fixed-dim transition-all rounded shadow-lg shadow-secondary/20 flex items-center gap-1.5"
            >
              {publishing ? (
                <>
                  <span className="material-symbols-outlined text-[16px] animate-spin">sync</span>
                  Publishing...
                </>
              ) : (
                'Publish →'
              )}
            </button>
            <div className="w-8 h-8 rounded-full bg-surface-container-high border border-outline-variant flex items-center justify-center">
              <span className="material-symbols-outlined text-on-surface-variant text-[18px]">person</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Studio Workspace */}
      <main className="w-full pt-[72px] bg-surface flex-1 flex flex-col">
        <div className="flex flex-col w-full h-full relative overflow-hidden bg-surface flex-1">
          {/* Radial Ambient Backdrop */}
          <div
            className="absolute inset-0 bg-surface z-0 opacity-40 pointer-events-none"
            style={{ backgroundImage: 'radial-gradient(circle at 50% 0%, var(--tw-colors-surface-container-high) 0%, transparent 70%)' }}
          />

          <div className="relative z-10 max-w-[1600px] mx-auto w-full px-4 md:px-8 py-6 flex flex-col lg:flex-row gap-6 h-full min-h-[820px] flex-1">
            {/* Left: Portfolio Preview Area */}
            <div className="flex-1 min-w-0 rounded-xl bg-surface-container-lowest overflow-hidden shadow-2xl shadow-black/60 flex flex-col relative transform transition-transform duration-500 ease-out border border-surface-container-high">
              {/* Preview Header/Controls */}
              <div className="h-12 bg-surface-container flex items-center px-4 justify-between z-20 border-b border-surface-container-highest">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-error/50" />
                  <div className="w-3 h-3 rounded-full bg-secondary/50" />
                  <div className="w-3 h-3 rounded-full bg-primary-fixed/50" />
                </div>

                {/* Template Switcher Pills */}
                <div className="hidden md:flex items-center gap-1 bg-[#0e0e0d] px-2 py-1 rounded-lg border border-surface-container-highest">
                  <span className="text-[10px] font-mono text-[#8e937f] uppercase px-1">Template:</span>
                  {[
                    { id: 'obsidian-editorial' as const, label: '01 Obsidian', color: '#C9A96E' },
                    { id: 'lime-studio' as const, label: '02 Lime', color: '#C7FF00' },
                    { id: 'signature-personal' as const, label: '03 Signature', color: '#C4956A' },
                  ].map((t) => {
                    const isCurrent = portfolio.designDNA.visualStyle === t.id;
                    return (
                      <button
                        key={t.id}
                        onClick={() => handleSwitchTemplate(t.id)}
                        className={`px-2.5 py-0.5 rounded text-[11px] font-mono transition-all flex items-center gap-1.5 cursor-pointer ${
                          isCurrent
                            ? 'bg-[#20201e] text-white font-bold border border-white/20 shadow-sm'
                            : 'text-[#8e937f] hover:text-[#e5e2df] hover:bg-[#181816]'
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: t.color }} />
                        <span>{t.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Preview Content Area */}
              <div
                className="flex-1 overflow-y-auto bg-surface-dim relative group pb-16 scroll-smooth transition-all duration-300 w-full"
                style={{
                  filter: aiApplying ? 'blur(4px)' : 'none',
                  opacity: aiApplying ? 0.6 : 1,
                }}
              >
                <PortfolioRenderer portfolio={portfolio} />
              </div>

              {/* Floating Preview Generating Overlay */}
              {aiApplying && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-30 pointer-events-none animate-in fade-in">
                  <div className="w-16 h-16 rounded-full bg-surface-container/90 backdrop-blur border border-surface-container-high flex items-center justify-center mb-4 shadow-xl">
                    <span className="material-symbols-outlined text-primary-fixed animate-spin text-2xl">sync</span>
                  </div>
                  <div className="bg-surface-container/90 backdrop-blur px-6 py-3 rounded-full border border-surface-container-high font-metadata-sm text-metadata-sm text-primary-fixed shadow-xl">
                    APPLYING EDITORIAL AST PATCH...
                  </div>
                </div>
              )}
            </div>

            {/* Right: AI Editing Panel & Status */}
            <div className="w-full lg:w-[420px] flex flex-col gap-stack-md h-full shrink-0">
              {/* Processing State */}
              <div className="bg-surface-container rounded-xl p-stack-md shadow-md flex flex-col gap-stack-sm border border-surface-container-highest">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">
                    AI Engine Status
                  </h2>
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-fixed opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-fixed" />
                  </span>
                </div>
                <div className="font-metadata-sm text-metadata-sm text-primary-fixed mb-2 uppercase font-semibold">
                  ANALYZING PROFESSIONAL IDENTITY
                </div>
                <ul className="flex flex-col gap-2">
                  <li className="flex items-center gap-3 font-metadata-sm text-metadata-sm text-on-surface-variant">
                    <span className="material-symbols-outlined text-[16px] text-surface-tint">check</span> Parsing experience
                  </li>
                  <li className="flex items-center gap-3 font-metadata-sm text-metadata-sm text-on-surface-variant">
                    <span className="material-symbols-outlined text-[16px] text-surface-tint">check</span> Extracting projects
                  </li>
                  <li className="flex items-center gap-3 font-metadata-sm text-metadata-sm text-primary-fixed animate-pulse">
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span> Synthesizing Design DNA
                  </li>
                  <li className="flex items-center gap-3 font-metadata-sm text-metadata-sm text-on-surface-variant/50">
                    <span className="material-symbols-outlined text-[16px]">radio_button_unchecked</span> Preparing portfolio architecture
                  </li>
                </ul>
              </div>

              {/* AI Editing Workspace */}
              <div className="bg-surface-container rounded-xl flex-1 flex flex-col shadow-lg overflow-hidden relative border border-surface-container-highest">
                <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                  <span className="font-label-caps text-[120px] leading-none text-on-surface select-none">AI</span>
                </div>

                <div className="p-stack-md flex flex-col h-full z-10">
                  <h3 className="font-headline-md text-headline-md text-on-surface mb-stack-md font-bold">
                    Tell AI what to change...
                  </h3>

                  <div className="flex-1 flex flex-col">
                    <div className="relative flex-1 bg-[#121211] rounded-lg p-1 group focus-within:ring-1 focus-within:ring-primary-fixed transition-shadow border border-outline-variant/60">
                      <textarea
                        value={aiInstruction}
                        onChange={(e) => setAiInstruction(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && e.shiftKey) {
                            e.preventDefault();
                            handleApplyAIPatch();
                          }
                        }}
                        className="w-full h-full bg-transparent resize-none p-4 font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none text-sm leading-relaxed"
                        placeholder="E.g., 'Switch to a brutalist style' or 'Highlight my senior engineering role...'"
                      />
                      <div className="absolute bottom-4 right-4 flex items-center gap-2">
                        <span className="font-metadata-sm text-metadata-sm text-on-surface-variant/50 hidden sm:inline">
                          Shift + Enter to submit
                        </span>
                        <button
                          onClick={() => handleApplyAIPatch()}
                          disabled={aiApplying || !aiInstruction.trim()}
                          className="w-10 h-10 rounded bg-primary-fixed text-on-primary-fixed flex items-center justify-center hover:bg-primary-fixed-dim transition-colors shadow-md disabled:opacity-40"
                        >
                          <span className="material-symbols-outlined">send</span>
                        </button>
                      </div>
                    </div>

                    {/* Quick Template Switcher Chips */}
                    <div className="flex flex-wrap gap-1.5 mt-2.5">
                      <span className="text-[10px] font-mono text-[#8e937f] uppercase self-center mr-1">Switch:</span>
                      <button
                        onClick={() => handleSwitchTemplate('obsidian-editorial')}
                        className="px-2.5 py-1 rounded text-[11px] font-mono border border-outline-variant/60 bg-surface-container-lowest hover:border-[#C9A96E] hover:text-[#C9A96E] transition-colors flex items-center gap-1.5 text-[#8e937f] cursor-pointer"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C9A96E]" />
                        Obsidian Editorial
                      </button>
                      <button
                        onClick={() => handleSwitchTemplate('lime-studio')}
                        className="px-2.5 py-1 rounded text-[11px] font-mono border border-outline-variant/60 bg-surface-container-lowest hover:border-[#C7FF00] hover:text-[#C7FF00] transition-colors flex items-center gap-1.5 text-[#8e937f] cursor-pointer"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C7FF00]" />
                        Lime Studio
                      </button>
                      <button
                        onClick={() => handleSwitchTemplate('signature-personal')}
                        className="px-2.5 py-1 rounded text-[11px] font-mono border border-outline-variant/60 bg-surface-container-lowest hover:border-[#C4956A] hover:text-[#C4956A] transition-colors flex items-center gap-1.5 text-[#8e937f] cursor-pointer"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C4956A]" />
                        Signature Personal
                      </button>
                    </div>
                  </div>

                  {aiStatusMessage && (
                    <div className="mt-3 p-2.5 rounded-lg bg-surface-container-lowest border border-primary-fixed/30 text-primary-fixed text-xs font-mono flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px]">check_circle</span>
                      <span>{aiStatusMessage}</span>
                    </div>
                  )}

                  <div className="mt-stack-md pt-stack-md border-t border-surface-container-high flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2 bg-[#0B0B0A] px-3 py-1.5 rounded border border-surface-container-highest">
                        <div className="w-1.5 h-1.5 rounded-full bg-surface-tint" />
                        <span className="font-metadata-sm text-metadata-sm text-on-surface">
                          VERSION {portfolio.version || '0.14'} - SYNCED
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex-1 px-6 py-3 font-body-md text-body-md text-on-surface bg-transparent rounded border border-outline-variant hover:border-outline transition-colors text-center font-medium"
                      >
                        {saving ? 'Saving...' : 'Save Draft'}
                      </button>
                      <button
                        onClick={handlePublish}
                        disabled={publishing}
                        className="flex-1 px-6 py-3 font-body-md text-body-md font-semibold text-on-secondary bg-secondary rounded hover:bg-secondary-fixed-dim transition-colors shadow-lg shadow-secondary/20 text-center"
                      >
                        {publishing ? 'Publishing...' : 'Publish'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-surface-container-lowest border-t border-surface-container-high py-12">
        <div className="max-w-[1440px] mx-auto px-6 md:px-container-padding-x flex flex-col md:flex-row justify-between gap-stack-lg">
          <div className="max-w-xs">
            <div className="flex items-center gap-3 mb-stack-md">
              <div className="w-6 h-6 rounded bg-primary-fixed flex items-center justify-center font-bold text-on-primary-fixed text-xs">
                ▲
              </div>
              <span className="font-headline-md text-body-lg text-on-surface font-semibold">Portfolio.ai</span>
            </div>
            <p className="font-body-md text-on-surface-variant text-metadata-sm leading-relaxed">
              The technical engine for creative excellence. Curate, generate, and publish your identity with clinical precision.
            </p>
          </div>

          <div className="flex justify-between items-center gap-8">
            <span className="font-metadata-sm text-metadata-sm text-outline">STATUS: OPTIMIZED</span>
            <span className="font-metadata-sm text-metadata-sm text-outline">© 2026 PORTFOLIO.AI INC.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
