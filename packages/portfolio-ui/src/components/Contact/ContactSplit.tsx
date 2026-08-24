import React, { useState } from 'react';
import { SectionContainer } from '../SectionContainer.js';
import type { PortfolioSection, DesignDNA } from '@portfolio-ai/types';
import { cn } from '../../utils.js';
import { Mail, MapPin, Send, CheckCircle2, AlertCircle, Loader2, RotateCcw } from 'lucide-react';

interface ContactProps {
  section: PortfolioSection;
  designDNA: DesignDNA;
  portfolioId?: string;
}

type FormState = 'idle' | 'submitting' | 'success' | 'error';

export const ContactSplit: React.FC<ContactProps> = ({ section, designDNA, portfolioId }) => {
  const content = section.content as {
    email?: string;
    location?: string;
    socials?: Array<{ platform: string; url: string }>;
  };

  const [formState, setFormState] = useState<FormState>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const isDark = designDNA.colorMode === 'dark';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setFormState('submitting');
    setErrorMessage(null);

    try {
      const apiBaseUrl =
        (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_API_URL) ||
        'http://localhost:4000/api/v1';

      const endpoint = portfolioId
        ? `${apiBaseUrl}/contact/${portfolioId}`
        : `${apiBaseUrl}/contact`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          subject: subject.trim() || undefined,
          message: message.trim(),
          portfolioId,
          recipientEmail: content.email,
        }),
      });

      const json = await response.json();

      if (!response.ok || json.success === false) {
        const messageText =
          json.error?.message ||
          json.message ||
          'Something went wrong while sending your message. Please try again or contact me directly by email.';
        setErrorMessage(messageText);
        setFormState('error');
        return;
      }

      setFormState('success');
    } catch (err: unknown) {
      const messageText =
        err instanceof Error
          ? err.message
          : 'Network error occurred while sending your message. Please try again.';
      setErrorMessage(messageText);
      setFormState('error');
    }
  };

  return (
    <SectionContainer id={section.id} designDNA={designDNA} className="pb-24">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-5 flex flex-col gap-6">
          <h2
            className="text-3xl sm:text-4xl font-bold tracking-tight"
            style={{ fontFamily: designDNA.typography.displayFont }}
          >
            {section.title || 'Let’s Build Something Together'}
          </h2>
          <p className={cn('text-base leading-relaxed', isDark ? 'text-zinc-400' : 'text-zinc-600')}>
            {section.subtitle ||
              'Open to technical leadership roles, high-scale consulting, and open-source collaborations.'}
          </p>

          <div className="flex flex-col gap-4 pt-4">
            {content.email && (
              <a
                href={`mailto:${content.email}`}
                className="flex items-center gap-3 text-sm hover:text-emerald-400 transition-colors"
              >
                <Mail className="w-5 h-5 text-emerald-500" />
                <span>{content.email}</span>
              </a>
            )}

            {content.location && (
              <div className="flex items-center gap-3 text-sm text-zinc-400">
                <MapPin className="w-5 h-5 text-emerald-500" />
                <span>{content.location}</span>
              </div>
            )}
          </div>
        </div>

        <div
          className={cn(
            'lg:col-span-7 rounded-2xl border p-8 backdrop-blur-sm',
            isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-white border-zinc-200 shadow-md'
          )}
        >
          {formState === 'success' ? (
            <div className="flex flex-col items-center justify-center py-12 gap-4 text-center">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 animate-bounce" />
              <h3 className="text-xl font-bold">Message Sent!</h3>
              <p className="text-sm text-zinc-400 max-w-sm">
                Thank you for reaching out. Your message has been delivered successfully. I'll get back to you shortly.
              </p>
              <button
                type="button"
                onClick={() => {
                  setName('');
                  setEmail('');
                  setSubject('');
                  setMessage('');
                  setFormState('idle');
                }}
                className="mt-4 text-xs text-emerald-400 hover:underline font-medium"
              >
                ← Send another message
              </button>
            </div>
          ) : formState === 'error' ? (
            <div className="flex flex-col items-center justify-center py-10 gap-4 text-center">
              <AlertCircle className="w-12 h-12 text-red-500" />
              <h3 className="text-xl font-bold text-red-400">Unable to send message</h3>
              <p className="text-sm text-zinc-400 max-w-md">
                {errorMessage ||
                  'Something went wrong while sending your message. Please try again or contact me directly by email.'}
              </p>
              <button
                type="button"
                onClick={() => setFormState('idle')}
                className="mt-2 inline-flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors border border-zinc-700"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Try Again
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-zinc-400">Your Name</label>
                  <input
                    type="text"
                    required
                    disabled={formState === 'submitting'}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jane Doe"
                    className={cn(
                      'px-4 py-2.5 rounded-lg border text-sm outline-none transition-colors disabled:opacity-50',
                      isDark
                        ? 'bg-zinc-950 border-zinc-800 focus:border-emerald-500 text-zinc-100'
                        : 'bg-zinc-50 border-zinc-300 focus:border-emerald-500 text-zinc-900'
                    )}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-zinc-400">Your Email</label>
                  <input
                    type="email"
                    required
                    disabled={formState === 'submitting'}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jane@company.com"
                    className={cn(
                      'px-4 py-2.5 rounded-lg border text-sm outline-none transition-colors disabled:opacity-50',
                      isDark
                        ? 'bg-zinc-950 border-zinc-800 focus:border-emerald-500 text-zinc-100'
                        : 'bg-zinc-50 border-zinc-300 focus:border-emerald-500 text-zinc-900'
                    )}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-zinc-400">Subject (Optional)</label>
                <input
                  type="text"
                  disabled={formState === 'submitting'}
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Freelance Project / Consulting Opportunity"
                  className={cn(
                    'px-4 py-2.5 rounded-lg border text-sm outline-none transition-colors disabled:opacity-50',
                    isDark
                      ? 'bg-zinc-950 border-zinc-800 focus:border-emerald-500 text-zinc-100'
                      : 'bg-zinc-50 border-zinc-300 focus:border-emerald-500 text-zinc-900'
                  )}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-zinc-400">Message</label>
                <textarea
                  rows={4}
                  required
                  disabled={formState === 'submitting'}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell me about your project or opportunity..."
                  className={cn(
                    'px-4 py-2.5 rounded-lg border text-sm outline-none transition-colors resize-none disabled:opacity-50',
                    isDark
                      ? 'bg-zinc-950 border-zinc-800 focus:border-emerald-500 text-zinc-100'
                      : 'bg-zinc-50 border-zinc-300 focus:border-emerald-500 text-zinc-900'
                  )}
                />
              </div>

              <button
                type="submit"
                disabled={formState === 'submitting'}
                className="mt-2 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold transition-all transform active:scale-95 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: designDNA.colorPalette.accent,
                  color: designDNA.colorPalette.accentForeground,
                }}
              >
                {formState === 'submitting' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending message...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </SectionContainer>
  );
};
