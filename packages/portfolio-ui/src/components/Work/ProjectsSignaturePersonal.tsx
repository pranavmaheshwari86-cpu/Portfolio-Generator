import React from 'react';
import { SectionContainer } from '../SectionContainer.js';
import type { PortfolioSection, DesignDNA } from '@portfolio-ai/types';
import { ArrowRight, Github, ExternalLink, Sparkles } from 'lucide-react';

interface ProjectsProps {
  section: PortfolioSection;
  designDNA: DesignDNA;
}

export const ProjectsSignaturePersonal: React.FC<ProjectsProps> = ({ section, designDNA }) => {
  const content = section.content as {
    projects?: Array<{
      id?: string;
      title: string;
      description?: string;
      technologies?: string[];
      tags?: string[];
      highlights?: string[];
      liveUrl?: string;
      githubUrl?: string;
      image?: string;
    }>;
  };

  const rawProjects = Array.isArray(content?.projects) ? content.projects : [];
  const projects =
    rawProjects.length > 0
      ? rawProjects
      : [
          {
            id: 'proj-1',
            title: 'Neural Core Telemetry Platform',
            description:
              'Real-time distributed observability platform monitoring multi-tenant LLM inferences with sub-millisecond latency dashboards.',
            technologies: ['TypeScript', 'Next.js', 'Python', 'FastAPI', 'Redis'],
            highlights: ['Sub-50ms p95 latency', '5,000+ Concurrent telemetry streams'],
            githubUrl: 'https://github.com',
          },
          {
            id: 'proj-2',
            title: 'Autonomous Agent Orchestration Engine',
            description:
              'Event-driven multi-agent framework facilitating deterministic state machines, vector search memory, and self-healing tools.',
            technologies: ['React', 'Node.js', 'PostgreSQL', 'LangChain', 'Tailwind'],
            highlights: ['Zero-downtime task recovery', 'Production AST code compilation'],
            githubUrl: 'https://github.com',
          },
        ];

  const accentColor = designDNA.colorPalette.accent || '#C4956A';
  const surfaceColor = designDNA.colorPalette.surface || '#F2EEE7';
  const borderColor = designDNA.colorPalette.border || '#E3DCD1';
  const mutedColor = designDNA.colorPalette.muted || '#78716C';

  return (
    <SectionContainer id={section.id || 'work'} designDNA={designDNA} className="py-20">
      <div className="w-full max-w-[1440px] mx-auto flex flex-col gap-12">
        {/* Section Header */}
        <div className="flex flex-col gap-3 max-w-2xl">
          <span
            className="text-xs uppercase tracking-widest font-mono font-semibold"
            style={{ color: accentColor }}
          >
            CASE STUDIES & WORK
          </span>
          <h2
            className="text-3xl sm:text-5xl font-bold tracking-tight text-[#1C1917]"
            style={{ fontFamily: designDNA.typography.displayFont || 'Playfair Display, serif' }}
          >
            {section.title || 'Selected Projects'}
          </h2>
          {section.subtitle && (
            <p className="text-base text-[#78716C] font-sans leading-relaxed">
              {section.subtitle}
            </p>
          )}
        </div>

        {/* Editorial Case Study Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project, idx) => {
            const title = project.title || `Project 0${idx + 1}`;
            const rawTechs = project.technologies || project.tags || [];
            const techs: string[] =
              Array.isArray(rawTechs) && rawTechs.length > 0
                ? rawTechs
                : ['Next.js', 'TypeScript', 'Design Systems'];
            const description =
              project.description ||
              'Crafted a bespoke digital architecture combining ergonomic design with scalable systems.';
            const highlights = project.highlights || [];
            const liveUrl = project.liveUrl;
            const githubUrl = project.githubUrl;

            return (
              <div
                key={project.id || idx}
                className="p-8 rounded-2xl border flex flex-col justify-between gap-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group"
                style={{
                  backgroundColor: surfaceColor,
                  borderColor: borderColor,
                }}
              >
                <div className="flex flex-col gap-4">
                  {/* Top Category & Year */}
                  <div className="flex items-center justify-between text-xs font-mono text-[#78716C]">
                    <span className="font-semibold" style={{ color: accentColor }}>
                      0{idx + 1} // CASE STUDY
                    </span>
                    <span>2026</span>
                  </div>

                  <h3
                    className="text-2xl sm:text-3xl font-bold text-[#1C1917] group-hover:text-[#C4956A] transition-colors leading-tight"
                    style={{ fontFamily: designDNA.typography.displayFont || 'Playfair Display, serif' }}
                  >
                    {title}
                  </h3>

                  <p className="text-sm sm:text-base text-[#44403C] font-sans leading-relaxed">
                    {description}
                  </p>

                  {highlights.length > 0 && (
                    <div className="flex flex-col gap-2 pt-2">
                      {highlights.map((h, hIdx) => (
                        <div key={hIdx} className="flex items-center gap-2 text-xs font-sans text-[#78716C]">
                          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accentColor }} />
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-4 pt-4 border-t" style={{ borderColor: borderColor }}>
                  <div className="flex flex-wrap gap-1.5">
                    {techs.map((tech, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-2.5 py-1 text-xs rounded-md bg-[#FAF8F4] border text-[#44403C] font-mono"
                        style={{ borderColor: borderColor }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    {githubUrl ? (
                      <a
                        href={githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-mono text-[#78716C] hover:text-[#1C1917] flex items-center gap-1.5 transition-colors"
                      >
                        <Github className="w-3.5 h-3.5" />
                        <span>Source</span>
                      </a>
                    ) : (
                      <span />
                    )}

                    {liveUrl && (
                      <a
                        href={liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-medium flex items-center gap-1.5 transition-transform group-hover:translate-x-1"
                        style={{ color: accentColor }}
                      >
                        <span>View Project</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </SectionContainer>
  );
};
