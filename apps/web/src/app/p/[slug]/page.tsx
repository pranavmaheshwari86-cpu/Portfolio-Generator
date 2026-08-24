'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ApiClient } from '@/lib/api-client';
import { PortfolioRenderer } from '@portfolio-ai/portfolio-ui';
import type { PortfolioSchema } from '@portfolio-ai/types';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function PublicPortfolioPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [portfolio, setPortfolio] = useState<PortfolioSchema | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPublicPortfolio() {
      try {
        const res = await ApiClient.request<{ id: string; schemaData: PortfolioSchema }>(
          `/portfolios/public/${slug}`
        );
        setPortfolio(res.schemaData);

        // Record public visit hit
        const device =
          window.innerWidth < 640 ? 'mobile' : window.innerWidth < 1024 ? 'tablet' : 'desktop';
        ApiClient.request(`/analytics/${res.id}/hit`, {
          method: 'POST',
          body: JSON.stringify({ device, referrer: document.referrer || 'direct' }),
        }).catch(() => {});
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Portfolio not found');
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      loadPublicPortfolio();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090B] flex items-center justify-center text-zinc-100">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
      </div>
    );
  }

  if (error || !portfolio) {
    return (
      <div className="min-h-screen bg-[#09090B] flex flex-col items-center justify-center gap-4 text-zinc-100">
        <h1 className="text-2xl font-bold font-display">Portfolio Not Found</h1>
        <p className="text-sm text-zinc-400">
          The requested portfolio /{slug} is either unpublished or does not exist.
        </p>
        <Link href="/" className="text-emerald-400 text-xs hover:underline mt-2">
          ← Return to Portfolio.AI
        </Link>
      </div>
    );
  }

  return <PortfolioRenderer portfolio={portfolio} />;
}
