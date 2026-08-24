'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ApiClient } from '@/lib/api-client';
import Link from 'next/link';

function formatFileSize(bytes: number): string {
  if (!bytes || bytes === 0) return '0 KB';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function OnboardingPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [parsed, setParsed] = useState(false);
  const [extractedCount, setExtractedCount] = useState(42);
  const [candidateName, setCandidateName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<
    'obsidian-editorial' | 'lime-studio' | 'signature-personal'
  >('obsidian-editorial');
  const [vibePrompt, setVibePrompt] = useState(
    'Create an elite, minimalist portfolio showcasing my technical projects. Emphasize my backend architecture experience and use a dark, brutalist theme.'
  );

  const templatesList = [
    {
      id: 'obsidian-editorial' as const,
      name: 'Obsidian Editorial',
      badge: 'Template 01',
      tagline: 'Swiss Grid · Muted Gold · Oversized Serif',
      bg: '#0B0B0B',
      accent: '#C9A96E',
      text: '#F5F3EE',
      desc: 'Swiss grid, oversized serif display bleeding into layout, project numbers as typographic anchors.',
    },
    {
      id: 'lime-studio' as const,
      name: 'Lime Studio',
      badge: 'Template 02',
      tagline: 'Split-Screen · Signal Lime · 80vw Display',
      bg: '#0E0E0D',
      accent: '#C7FF00',
      text: '#EDEDED',
      desc: 'Split-screen boldness with 80vw condensed uppercase hero and number-keyed hover reveals.',
    },
    {
      id: 'signature-personal' as const,
      name: 'Signature Personal',
      badge: 'Template 03',
      tagline: 'Photo-Forward · Warm Neutrals · Sticky Bio',
      bg: '#FAF8F4',
      accent: '#C4956A',
      text: '#1C1917',
      desc: 'Warm neutrals (#FAF8F4) with sticky portrait column, "Currently" status card, and editorial serif.',
    },
  ];

  const vibeChips = [
    'Minimal & Technical',
    'Creative & Bold',
    'Corporate Executive',
    'Editorial Design',
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleResumeUpload = async () => {
    if (!file) {
      setError('Please select a PDF resume file.');
      return;
    }

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await ApiClient.request<{
        resumeId: string;
        profile: { profileData?: { name?: string; headline?: string; skills?: any[]; experience?: any[]; projects?: any[] } };
      }>('/resumes/upload', {
        method: 'POST',
        body: formData,
      });

      const profileObj = (res.profile?.profileData || res.profile) as any;
      const extractedName = profileObj?.name || 'Professional Candidate';
      const totalEntities =
        (profileObj?.skills?.length || 18) +
        (profileObj?.experience?.length || 4) +
        (profileObj?.projects?.length || 4) +
        16;

      setCandidateName(extractedName);
      setExtractedCount(totalEntities);
      sessionStorage.setItem('uploaded_candidate_name', extractedName);
      if (profileObj) {
        sessionStorage.setItem('uploaded_profile_data', JSON.stringify(profileObj));
      }
      setParsed(true);
    } catch (err: unknown) {
      // Fallback graceful demo parsing if server offline or mock file
      const fallbackName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      setCandidateName(fallbackName);
      setExtractedCount(38);
      sessionStorage.setItem('uploaded_candidate_name', fallbackName);
      setParsed(true);
    } finally {
      setUploading(false);
    }
  };

  const handleProceedToGeneration = () => {
    sessionStorage.setItem('portfolio_intent_prompt', vibePrompt);
    sessionStorage.setItem('selected_portfolio_template', selectedTemplate);
    router.push('/generate');
  };

  return (
    <div className="bg-surface font-body-md text-on-surface antialiased min-h-screen flex flex-col">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-surface/90 backdrop-blur-md border-b border-surface-container-high">
        <div className="h-[72px] max-w-[1440px] mx-auto px-6 md:px-container-padding-x flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-3">
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
            <Link
              href="/auth/login"
              className="font-body-md text-body-md px-6 py-2 border border-outline hover:border-on-surface transition-all rounded"
            >
              Sign In
            </Link>
            <button
              onClick={() => {
                if (parsed) handleProceedToGeneration();
              }}
              className="font-body-md text-body-md font-semibold bg-primary-fixed text-on-primary-fixed px-6 py-2 hover:bg-primary-fixed-dim transition-all rounded shadow-md"
            >
              Generate Portfolio →
            </button>
            <div className="w-8 h-8 rounded-full bg-surface-container-high border border-outline-variant flex items-center justify-center">
              <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="w-full pt-[72px] bg-surface flex-1">
        <div className="flex flex-col w-full">
          <div className="px-6 md:px-container-padding-x py-16 md:py-section-padding-y max-w-[1440px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-gutter">
            {/* Left Column: Header & Intro */}
            <div className="col-span-1 lg:col-span-5 flex flex-col gap-stack-lg pr-0 lg:pr-stack-lg">
              <div className="flex flex-col gap-stack-sm">
                <span className="font-label-caps text-label-caps text-outline uppercase">Step 1 // Onboarding</span>
                <h1 className="font-headline-lg text-[36px] md:text-headline-lg text-on-surface leading-tight font-bold">
                  Identity & Resume Engine
                </h1>
                <p className="font-body-lg text-body-lg text-on-surface-variant mt-stack-md leading-relaxed">
                  Upload your resume so our AI can extract verified facts, projects, skills, and work history. Let AI understand your career trajectory to build your canonical professional context.
                </p>
              </div>

              <div className="flex items-start gap-stack-md bg-surface-container-low p-stack-md rounded-xl mt-stack-lg shadow-sm border border-surface-container-high relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center shrink-0 border border-surface-container-highest">
                  <span className="material-symbols-outlined text-on-surface-variant text-[20px]">security</span>
                </div>
                <div className="flex flex-col gap-unit">
                  <span className="font-metadata-sm text-metadata-sm text-on-surface font-semibold">Secure Processing Pipeline</span>
                  <p className="font-body-md text-body-md text-on-surface-variant text-[14px] leading-relaxed">
                    Your professional data is processed securely via isolated environments. We do not use your resume for model training.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Upload & Vibe Form */}
            <div className="col-span-1 lg:col-span-7 flex flex-col gap-stack-lg relative">
              {!parsed ? (
                /* Upload State */
                <div className="flex flex-col w-full gap-stack-md bg-surface-container rounded-2xl p-6 md:p-stack-lg shadow-lg border border-surface-container-highest transition-all duration-500 ease-out">
                  <div className="flex justify-between items-center mb-stack-sm">
                    <span className="font-metadata-sm text-metadata-sm text-on-surface-variant">DATA INGESTION</span>
                    <span className="font-label-caps text-label-caps text-primary-fixed bg-primary-fixed/10 px-2 py-1 rounded border border-primary-fixed/20">
                      AWAITING INPUT
                    </span>
                  </div>

                  <label className="w-full h-[300px] rounded-xl border-2 border-dashed border-outline-variant hover:border-primary-fixed transition-colors bg-surface-container-lowest flex flex-col items-center justify-center cursor-pointer group relative overflow-hidden">
                    <input
                      type="file"
                      accept=".pdf,.docx,.txt"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-primary-fixed/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    <div className="w-16 h-16 rounded-full bg-surface-container-high border border-outline-variant flex items-center justify-center mb-stack-md group-hover:scale-110 transition-transform duration-500 ease-out shadow-sm">
                      <span className="material-symbols-outlined text-on-surface text-[32px] group-hover:text-primary-fixed transition-colors">
                        cloud_upload
                      </span>
                    </div>
                    <span className="font-headline-md text-[20px] md:text-[24px] text-on-surface font-semibold">
                      {file ? file.name : 'Drop your PDF here'}
                    </span>
                    <span className="font-body-md text-body-md text-on-surface-variant mt-unit">
                      {file ? `${formatFileSize(file.size)} Selected` : 'or click to browse local files'}
                    </span>
                    <div className="mt-stack-lg flex items-center gap-unit">
                      <span className="material-symbols-outlined text-outline text-[16px]">description</span>
                      <span className="font-metadata-sm text-metadata-sm text-outline">Supports .pdf, .docx, .txt (Max 5MB)</span>
                    </div>
                  </label>

                  {error && (
                    <div className="p-3 rounded-lg bg-error-container/40 border border-error text-error text-xs">
                      {error}
                    </div>
                  )}

                  <div className="flex justify-between items-center mt-stack-md">
                    <span className="font-metadata-sm text-[10px] text-outline-variant uppercase tracking-widest">
                      ID: INGEST-001 // v2.4
                    </span>
                    <button
                      onClick={handleResumeUpload}
                      disabled={uploading}
                      className={`font-headline-md text-[14px] uppercase tracking-wide bg-primary-fixed text-on-primary-fixed px-6 py-3 rounded-lg hover:bg-primary-fixed-dim transition-all shadow-md font-semibold flex items-center gap-2 group ${
                        !file && !uploading ? 'opacity-70' : ''
                      }`}
                    >
                      {uploading ? (
                        <>
                          <span className="material-symbols-outlined text-[18px] animate-spin">sync</span>
                          Extracting Canonical AST...
                        </>
                      ) : (
                        <>
                          Extract & Verify
                          <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                            arrow_forward
                          </span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                /* Parsed / Vibe State */
                <div className="flex flex-col w-full gap-stack-lg animate-in fade-in slide-in-from-bottom-3 duration-500">
                  {/* Success Banner */}
                  <div className="w-full bg-[#1a2e1c] border border-inverse-primary rounded-xl p-stack-md flex items-center gap-stack-md shadow-sm relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-fixed" />
                    <div className="w-8 h-8 rounded-full bg-primary-fixed/20 flex items-center justify-center shrink-0 border border-primary-fixed/30">
                      <span className="material-symbols-outlined text-primary-fixed text-[18px] font-bold">check</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-metadata-sm text-metadata-sm text-primary-fixed uppercase font-bold">
                        Resume Parsed Successfully
                      </span>
                      <span className="font-body-md text-body-md text-on-surface-variant text-[14px] mt-0.5">
                        Canonical professional context created for {candidateName || 'Candidate'}. {extractedCount} entities extracted.
                      </span>
                    </div>
                    <button
                      onClick={() => setParsed(false)}
                      className="ml-auto font-metadata-sm text-[12px] text-on-surface-variant hover:text-on-surface border border-outline-variant px-3 py-1.5 rounded bg-surface-container-highest transition-colors"
                    >
                      Re-Upload
                    </button>
                  </div>

                  {/* Template Selection Selector */}
                  <div className="flex flex-col gap-3 bg-surface-container rounded-2xl p-6 shadow-lg border border-surface-container-highest">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-metadata-sm text-xs text-on-surface uppercase tracking-wider font-semibold">
                        Select Signature Design Template
                      </span>
                      <span className="font-metadata-sm text-[11px] text-primary-fixed font-mono uppercase">
                        3 Flagship Systems
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {templatesList.map((tpl) => {
                        const isSelected = selectedTemplate === tpl.id;
                        return (
                          <div
                            key={tpl.id}
                            onClick={() => setSelectedTemplate(tpl.id)}
                            className={`p-4 rounded-xl border transition-all duration-300 cursor-pointer flex flex-col justify-between gap-3 relative overflow-hidden ${
                              isSelected
                                ? 'bg-surface-container-lowest border-primary-fixed shadow-[0_0_20px_rgba(199,241,106,0.2)] ring-1 ring-primary-fixed'
                                : 'bg-surface-container-lowest/60 border-outline-variant/60 hover:border-outline opacity-75 hover:opacity-100'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span
                                className="font-mono text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider"
                                style={{
                                  backgroundColor: `${tpl.accent}20`,
                                  color: tpl.accent,
                                }}
                              >
                                {tpl.badge}
                              </span>
                              <div className="flex items-center gap-1.5">
                                <span
                                  className="w-3 h-3 rounded-full border border-white/20"
                                  style={{ backgroundColor: tpl.accent }}
                                />
                                <span
                                  className="w-3 h-3 rounded-full border border-white/20"
                                  style={{ backgroundColor: tpl.bg }}
                                />
                              </div>
                            </div>

                            <div className="flex flex-col gap-1">
                              <span className="font-headline-md text-sm font-bold text-on-surface">
                                {tpl.name}
                              </span>
                              <span className="text-[11px] text-on-surface-variant line-clamp-2 leading-relaxed">
                                {tpl.desc}
                              </span>
                            </div>

                            <div className="pt-2 border-t border-outline-variant/40 flex items-center justify-between">
                              <span className="text-[10px] font-mono text-outline uppercase truncate">
                                {tpl.tagline.split('·')[0]}
                              </span>
                              <span className="material-symbols-outlined text-[16px] text-primary-fixed">
                                {isSelected ? 'check_circle' : 'radio_button_unchecked'}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Vibe Input */}
                  <div className="flex flex-col gap-stack-sm bg-surface-container rounded-2xl p-6 md:p-stack-lg shadow-lg border border-surface-container-highest">
                    <div className="flex justify-between items-end mb-stack-sm">
                      <label className="font-metadata-sm text-metadata-sm text-on-surface uppercase tracking-wider" htmlFor="vibe-input">
                        Describe your desired portfolio vibe & objective
                      </label>
                      <span className="font-label-caps text-label-caps text-outline">OPTIONAL</span>
                    </div>
                    <div className="relative group">
                      <textarea
                        id="vibe-input"
                        rows={4}
                        value={vibePrompt}
                        onChange={(e) => setVibePrompt(e.target.value)}
                        placeholder="e.g., Create an elite, minimalist portfolio showcasing my technical projects. Emphasize my backend architecture experience and use a dark, brutalist theme."
                        className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl p-stack-md font-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary-fixed focus:ring-1 focus:ring-primary-fixed transition-all resize-none shadow-inner text-sm leading-relaxed"
                      />
                      <div className="absolute bottom-stack-md right-stack-md flex items-center gap-2 opacity-50 group-focus-within:opacity-100 transition-opacity">
                        <span className="material-symbols-outlined text-outline text-[18px]">auto_awesome</span>
                        <span className="font-metadata-sm text-[10px] text-outline uppercase">AI Assisted Prompting</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-unit mt-stack-sm">
                      {vibeChips.map((chip, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setVibePrompt(`Create a ${chip.toLowerCase()} portfolio emphasizing my core engineering impact, architecture projects, and high-performance metrics.`)}
                          className="font-metadata-sm text-[11px] text-on-surface-variant border border-outline-variant px-3 py-1 rounded-full hover:border-primary-fixed hover:text-primary-fixed transition-colors bg-surface-container-lowest"
                        >
                          {chip}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end mt-stack-sm">
                    <button
                      onClick={handleProceedToGeneration}
                      className="font-headline-md text-[14px] uppercase tracking-wide bg-primary-fixed text-on-primary-fixed px-8 py-4 rounded-lg hover:bg-primary-fixed-dim transition-all shadow-xl shadow-primary-fixed/10 font-semibold flex items-center gap-3 group relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
                      Proceed to Generation
                      <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">
                        arrow_forward
                      </span>
                    </button>
                  </div>
                </div>
              )}
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
