import React from 'react';
import type { PortfolioNavigation, DesignDNA } from '@portfolio-ai/types';
import { cn } from '../utils.js';

interface NavbarProps {
  navigation: PortfolioNavigation;
  designDNA: DesignDNA;
}

export const Navbar: React.FC<NavbarProps> = ({ navigation, designDNA }) => {
  const isDark = designDNA.colorMode === 'dark';
  const bgColor = designDNA.colorPalette.background || (isDark ? '#0B0B0B' : '#FAF8F4');
  const borderColor = designDNA.colorPalette.border || (isDark ? '#262624' : '#E3DCD1');
  const textColor = designDNA.colorPalette.foreground || (isDark ? '#F5F3EE' : '#1C1917');
  const mutedColor = designDNA.colorPalette.muted || (isDark ? '#9E9B91' : '#78716C');
  const accentColor = designDNA.colorPalette.accent || '#C7FF00';
  const accentFg = designDNA.colorPalette.accentForeground || '#000000';

  return (
    <header
      className="sticky top-0 z-50 w-full backdrop-blur-md transition-colors border-b px-6 md:px-12 py-4 flex items-center justify-between"
      style={{
        backgroundColor: `${bgColor}dd`,
        borderColor: borderColor,
        color: textColor,
      }}
    >
      <div className="flex items-center gap-3">
        <a href="#" className="font-bold text-lg tracking-tight hover:opacity-80 transition-opacity">
          {navigation.brandText}
        </a>
      </div>

      <nav className="hidden md:flex items-center gap-8">
        {navigation.links.map((link) => (
          <a
            key={link.targetSectionId}
            href={`#${link.targetSectionId}`}
            className="text-xs font-mono uppercase tracking-wider transition-colors hover:opacity-100"
            style={{ color: mutedColor }}
          >
            {link.label}
          </a>
        ))}
      </nav>

      {navigation.ctaButton && (
        <a
          href={navigation.ctaButton.url || '#contact'}
          className="text-xs font-semibold px-4 py-2 rounded-lg transition-transform active:scale-95 shadow-sm font-mono uppercase tracking-wider"
          style={{
            backgroundColor: accentColor,
            color: accentFg,
          }}
        >
          {navigation.ctaButton.label}
        </a>
      )}
    </header>
  );
};
