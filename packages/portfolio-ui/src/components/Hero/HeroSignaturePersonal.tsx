import React from 'react';
import { SectionContainer } from '../SectionContainer.js';
import type { PortfolioSection, DesignDNA } from '@portfolio-ai/types';
import { Sparkles, MapPin, BookOpen, Coffee, ArrowRight, User } from 'lucide-react';

interface HeroProps {
  section: PortfolioSection;
  designDNA: DesignDNA;
}

export const HeroSignaturePersonal: React.FC<HeroProps> = ({ section, designDNA }) => {
  const content = section.content as {
    badgeText?: string;
    headline?: string;
    bio?: string;
    description?: string;
    primaryCtaText?: string;
    primaryCtaLink?: string;
    secondaryCtaText?: string;
    secondaryCtaLink?: string;
    avatarUrl?: string;
    currently?: {
      building?: string;
      reading?: string;
      location?: string;
    };
  };

  const name = (content as any).name || section.title || 'Alexander Wright';
  const subtitle = content.headline || section.subtitle || 'Software Engineer & Systems Builder';
  const bio =
    content.bio ||
    content.description ||
    'Hello! I am a full-stack engineer and designer crafting thoughtful digital experiences, robust architectures, and tools that empower creative people.';

  const accentColor = designDNA.colorPalette.accent || '#C4956A';
  const surfaceColor = designDNA.colorPalette.surface || '#F2EEE7';
  const borderColor = designDNA.colorPalette.border || '#E3DCD1';

  return (
    <SectionContainer id={section.id} designDNA={designDNA} className="pt-20 md:pt-28 pb-16">
      <div className="w-full max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left: Sticky Photo Column & "Currently" Profile Card */}
        <div className="lg:col-span-4 lg:sticky lg:top-24 flex flex-col gap-6">
          {/* Portrait Container */}
          <div
            className="w-full aspect-[4/5] rounded-2xl overflow-hidden border shadow-lg flex flex-col items-center justify-center relative p-6 group"
            style={{
              backgroundColor: surfaceColor,
              borderColor: borderColor,
            }}
          >
            {content.avatarUrl ? (
              <img
                src={content.avatarUrl}
                alt={name}
                className="w-full h-full object-cover rounded-xl transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-center gap-4">
                <div
                  className="w-24 h-24 rounded-full flex items-center justify-center shadow-inner"
                  style={{
                    backgroundColor: `${accentColor}20`,
                    color: accentColor,
                  }}
                >
                  <User className="w-12 h-12" />
                </div>
                <div className="flex flex-col">
                  <span className="font-serif text-2xl font-bold text-[#1C1917]">{name}</span>
                  <span className="text-xs text-[#78716C] font-sans mt-1">Personal Studio & Archive</span>
                </div>
              </div>
            )}

            {/* Bottom Floating Badge */}
            <div
              className="absolute bottom-4 left-4 right-4 px-4 py-2 rounded-xl backdrop-blur-md border flex items-center justify-between text-xs font-sans shadow-sm"
              style={{
                backgroundColor: '#FAF8F4ee',
                borderColor: borderColor,
                color: '#1C1917',
              }}
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: accentColor }} />
                <span className="font-medium">Open to collaborations</span>
              </div>
              <span className="text-[10px] text-[#78716C] font-mono">2026</span>
            </div>
          </div>

          {/* Signature "Currently" Section */}
          <div
            className="p-6 rounded-2xl border flex flex-col gap-4 shadow-sm"
            style={{
              backgroundColor: surfaceColor,
              borderColor: borderColor,
            }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-widest font-semibold font-mono" style={{ color: accentColor }}>
                CURRENTLY // 03
              </span>
              <Sparkles className="w-3.5 h-3.5" style={{ color: accentColor }} />
            </div>

            <div className="flex flex-col gap-3 text-xs font-sans">
              <div className="flex items-start gap-3">
                <Coffee className="w-4 h-4 shrink-0 text-[#C4956A] mt-0.5" />
                <div className="flex flex-col">
                  <span className="text-[#78716C]">Building</span>
                  <span className="font-medium text-[#1C1917]">
                    {content.currently?.building || 'Generative identity platforms & high-scale Next.js apps'}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <BookOpen className="w-4 h-4 shrink-0 text-[#C4956A] mt-0.5" />
                <div className="flex flex-col">
                  <span className="text-[#78716C]">Reading</span>
                  <span className="font-medium text-[#1C1917]">
                    {content.currently?.reading || 'The Design of Everyday Things & Distributed Systems in Practice'}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 shrink-0 text-[#C4956A] mt-0.5" />
                <div className="flex flex-col">
                  <span className="text-[#78716C]">Based In</span>
                  <span className="font-medium text-[#1C1917]">
                    {content.currently?.location || 'San Francisco, CA (Working Worldwide)'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Narrative Story & Editorial Bio */}
        <div className="lg:col-span-8 flex flex-col gap-8 pt-2">
          <div className="flex flex-col gap-4">
            <span
              className="text-xs uppercase tracking-widest font-mono font-semibold"
              style={{ color: accentColor }}
            >
              ABOUT & CRAFT
            </span>

            <h1
              className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-[#1C1917] leading-[1.08]"
              style={{ fontFamily: designDNA.typography.displayFont || 'Playfair Display, serif' }}
            >
              {subtitle}
            </h1>
          </div>

          <div className="flex flex-col gap-6 text-base sm:text-lg text-[#44403C] leading-relaxed font-sans">
            <p>{bio}</p>
            <p>
              I believe great software is where disciplined engineering meets thoughtful typography and human empathy. Every project is crafted from first principles with a focus on performance, accessibility, and enduring aesthetic clarity.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-4 border-t" style={{ borderColor: borderColor }}>
            <a
              href={content.primaryCtaLink || '#work'}
              className="px-8 py-4 rounded-xl font-medium text-sm transition-all shadow-md flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
              style={{
                backgroundColor: accentColor,
                color: '#FFFFFF',
              }}
            >
              <span>Explore Selected Work</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <a
              href={content.secondaryCtaLink || '#contact'}
              className="px-6 py-4 rounded-xl border font-medium text-sm transition-all hover:bg-black/5 text-[#1C1917]"
              style={{ borderColor: borderColor }}
            >
              Get in Touch
            </a>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
};
