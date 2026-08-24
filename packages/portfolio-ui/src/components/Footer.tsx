import React from 'react';
import type { PortfolioFooter, DesignDNA } from '@portfolio-ai/types';

interface FooterProps {
  footer: PortfolioFooter;
  designDNA: DesignDNA;
}

export const Footer: React.FC<FooterProps> = ({ footer, designDNA }) => {
  const isDark = designDNA.colorMode === 'dark';
  const bgColor = designDNA.colorPalette.surface || (isDark ? '#141414' : '#F2EEE7');
  const borderColor = designDNA.colorPalette.border || (isDark ? '#262624' : '#E3DCD1');
  const textColor = designDNA.colorPalette.foreground || (isDark ? '#F5F3EE' : '#1C1917');
  const mutedColor = designDNA.colorPalette.muted || (isDark ? '#9E9B91' : '#78716C');

  return (
    <footer
      className="w-full border-t px-6 md:px-12 py-12 flex flex-col md:flex-row items-center justify-between gap-6 text-xs font-mono"
      style={{
        backgroundColor: bgColor,
        borderColor: borderColor,
        color: mutedColor,
      }}
    >
      <div>{footer.copyrightText}</div>

      <div className="flex items-center gap-6">
        {footer.socialLinks.map((s: { platform: string; url: string }) => (
          <a
            key={s.platform}
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-100 transition-opacity uppercase tracking-wider"
            style={{ color: textColor }}
          >
            {s.platform}
          </a>
        ))}
      </div>

      {footer.backToTopButton && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="uppercase tracking-widest font-semibold hover:opacity-100 transition-opacity cursor-pointer"
        >
          Back to top ↑
        </button>
      )}
    </footer>
  );
};
