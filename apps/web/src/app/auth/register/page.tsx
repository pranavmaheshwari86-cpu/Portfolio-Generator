'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ApiClient } from '@/lib/api-client';
import { ArrowRight, Lock, Mail, User, Briefcase, AlertCircle } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [profession, setProfession] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await ApiClient.request<{ token: string }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password, profession }),
      });

      ApiClient.setToken(res.token);
      router.push('/onboarding');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090B] flex flex-col items-center justify-center p-6 text-zinc-100">
      <div className="w-full max-w-md flex flex-col gap-6">
        <div className="flex flex-col items-center text-center gap-2">
          <Link href="/" className="flex items-center gap-2 font-display text-xl font-black">
            <span className="w-8 h-8 rounded-lg bg-emerald-500 text-black flex items-center justify-center font-bold">
              P
            </span>
            PORTFOLIO<span className="text-emerald-400">.AI</span>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight mt-4">Create your account</h1>
          <p className="text-sm text-zinc-400">Start generating your bespoke personal website</p>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-950/40 border border-red-900/50 text-red-300 text-sm flex items-center gap-3">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-8 rounded-2xl border border-zinc-800 bg-zinc-900/40 backdrop-blur-sm flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-zinc-400">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3 top-3 text-zinc-500" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Rivera"
                className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-zinc-950 border border-zinc-800 focus:border-emerald-500 text-sm outline-none text-zinc-100 transition-colors"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-zinc-400">Profession / Title</label>
            <div className="relative">
              <Briefcase className="w-4 h-4 absolute left-3 top-3 text-zinc-500" />
              <input
                type="text"
                value={profession}
                onChange={(e) => setProfession(e.target.value)}
                placeholder="Senior Full Stack Engineer"
                className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-zinc-950 border border-zinc-800 focus:border-emerald-500 text-sm outline-none text-zinc-100 transition-colors"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-zinc-400">Email address</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-3 text-zinc-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-zinc-950 border border-zinc-800 focus:border-emerald-500 text-sm outline-none text-zinc-100 transition-colors"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-zinc-400">Password (min 8 chars)</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-3 text-zinc-500" />
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-zinc-950 border border-zinc-800 focus:border-emerald-500 text-sm outline-none text-zinc-100 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 py-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm transition-all transform active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Create Account'} <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-xs text-zinc-500">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-emerald-400 hover:underline font-semibold">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
