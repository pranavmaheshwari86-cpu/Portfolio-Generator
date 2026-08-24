'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ApiClient } from '@/lib/api-client';
import {
  Plus,
  Edit3,
  ArrowRight,
  Loader2,
  Sparkles,
  ExternalLink,
  Copy,
  CheckCircle2,
} from 'lucide-react';
import type { PortfolioSchema } from '@portfolio-ai/types';

interface PortfolioRecordSummary {
  id: string;
  name: string;
  slug: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  version: number;
  publishedUrl?: string;
  updatedAt: string;
  schemaData: PortfolioSchema;
}

export default function DashboardPage() {
  const [portfolios, setPortfolios] = useState<PortfolioRecordSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPortfolios() {
      try {
        const res = await ApiClient.request<PortfolioRecordSummary[]>('/portfolios');
        setPortfolios(res || []);
      } catch (err) {
        console.error('Failed to load user portfolios:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchPortfolios();
  }, []);

  const handleCopyLink = (slug: string) => {
    const url = `${window.location.origin}/p/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  const publishedCount = portfolios.filter((p) => p.status === 'PUBLISHED').length;

  return (
    <div className="min-h-screen bg-surface font-body-md text-on-surface antialiased flex flex-col selection:bg-primary-fixed/30 selection:text-primary-fixed relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/3 w-[800px] h-[350px] bg-primary-fixed/5 blur-[140px] pointer-events-none -z-10" />

      {/* Header */}
      <header className="border-b border-surface-container-high backdrop-blur-md bg-surface/90 px-6 md:px-container-padding-x py-4 flex items-center justify-between">
        <Link href="/" className="font-headline-md font-bold text-lg flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-primary-fixed flex items-center justify-center text-on-primary-fixed font-black text-xs shadow-sm">
            ▲
          </div>
          <span className="text-on-surface">Portfolio.ai</span>
          <span className="font-metadata-sm text-metadata-sm text-outline px-2 py-0.5 border border-outline-variant rounded uppercase">
            v1.0.4
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/onboarding"
            className="px-5 py-2 rounded bg-primary-fixed hover:bg-primary-fixed-dim text-on-primary-fixed font-bold text-xs transition-all flex items-center gap-1.5 shadow-md"
          >
            <Plus className="w-4 h-4" /> Create Portfolio
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-6 md:px-container-padding-x py-10 flex flex-col gap-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-headline-lg text-on-surface">Studio Workspace</h1>
            <p className="text-sm text-on-surface-variant mt-1">Manage and edit your bespoke AI portfolio instances.</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3.5 py-1.5 rounded-lg bg-surface-container border border-surface-container-highest flex items-center gap-2 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-primary-fixed" />
              <span className="text-on-surface-variant">Live Portfolios:</span>
              <span className="font-bold text-primary-fixed">{publishedCount}</span>
            </div>
            <div className="px-3.5 py-1.5 rounded-lg bg-surface-container border border-surface-container-highest flex items-center gap-2 text-xs font-mono">
              <span className="text-on-surface-variant">Total:</span>
              <span className="font-bold text-on-surface">{portfolios.length}</span>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="py-20 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary-fixed" />
          </div>
        ) : portfolios.length === 0 ? (
          <div className="p-12 rounded-2xl border border-dashed border-outline-variant bg-surface-container-low flex flex-col items-center justify-center text-center gap-4">
            <div className="w-14 h-14 rounded-full bg-surface-container flex items-center justify-center text-primary-fixed border border-surface-container-highest">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="font-bold text-lg font-headline-md text-on-surface">No Portfolios Created Yet</h3>
              <p className="text-xs text-on-surface-variant max-w-sm">
                Upload your resume or enter your positioning intent to synthesize your first production portfolio website.
              </p>
            </div>
            <Link
              href="/onboarding"
              className="mt-2 px-6 py-3 rounded-lg bg-primary-fixed hover:bg-primary-fixed-dim text-on-primary-fixed font-bold text-xs transition-all flex items-center gap-2 shadow-md"
            >
              <Plus className="w-4 h-4" /> Start Generating
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolios.map((item) => (
              <div
                key={item.id}
                className="rounded-xl border border-surface-container-highest bg-surface-container-low hover:border-outline transition-all duration-300 flex flex-col overflow-hidden group shadow-lg"
              >
                <div className="p-6 flex flex-col gap-4 flex-1">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] px-2.5 py-0.5 rounded-full font-mono uppercase tracking-wider ${
                        item.status === 'PUBLISHED'
                          ? 'bg-[#1a2e1c] text-primary-fixed border border-primary-fixed/30'
                          : 'bg-surface-container-high text-on-surface-variant border border-surface-container-highest'
                      }`}
                    >
                      {item.status}
                    </span>
                    <span className="text-xs font-mono text-outline">v{item.version}</span>
                  </div>

                  <div className="flex flex-col gap-1">
                    <h3 className="text-lg font-bold font-headline-md text-on-surface group-hover:text-primary-fixed transition-colors truncate">
                      {item.name}
                    </h3>
                    <p className="text-xs text-on-surface-variant font-mono">/p/{item.slug}</p>
                  </div>
                </div>

                <div className="border-t border-surface-container-highest px-6 py-3.5 bg-surface-container flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopyLink(item.slug)}
                      className="p-1.5 rounded hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-colors"
                      title="Copy Public Link"
                    >
                      {copiedSlug === item.slug ? (
                        <CheckCircle2 className="w-4 h-4 text-primary-fixed" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                    {item.status === 'PUBLISHED' && (
                      <Link
                        href={`/p/${item.slug}`}
                        target="_blank"
                        className="p-1.5 rounded hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-colors"
                        title="View Live Website"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    )}
                  </div>

                  <Link
                    href={`/editor/${item.id}`}
                    className="font-bold text-primary-fixed hover:text-primary-fixed-dim transition-colors flex items-center gap-1"
                  >
                    Open Studio <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-surface-container-high py-8 px-6 md:px-container-padding-x text-xs text-outline flex justify-between items-center bg-surface-container-lowest">
        <span>STATUS: OPTIMIZED</span>
        <span>© 2026 PORTFOLIO.AI INC.</span>
      </footer>
    </div>
  );
}
