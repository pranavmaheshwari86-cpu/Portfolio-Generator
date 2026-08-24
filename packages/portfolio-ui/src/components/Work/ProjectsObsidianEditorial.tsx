import React from 'react';
import { SectionContainer } from '../SectionContainer.js';
import type { PortfolioSection, DesignDNA } from '@portfolio-ai/types';
import { ArrowUpRight, Github, ExternalLink } from 'lucide-react';

interface ProjectsProps {
  section: PortfolioSection;
  designDNA: DesignDNA;
}

export const ProjectsObsidianEditorial: React.FC<ProjectsProps> = ({ section, designDNA }) => {
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

  const accentColor = designDNA.colorPalette.accent || '#C9A96E';
  const mutedColor = designDNA.colorPalette.muted || '#9E9B91';

  return (
    <SectionContainer id={section.id || 'work'} designDNA={designDNA} className="py-20">
      <div className="w-full max-w-[1440px] mx-auto flex flex-col">
        {/* Swiss Grid Section Header */}
        <div className="w-full flex flex-col sm:flex-row sm:items-end justify-between border-b border-[#262624] pb-6 mb-12 gap-4">
          <div className="flex flex-col gap-2">
            <span className="font-mono text-xs uppercase tracking-widest" style={{ color: accentColor }}>
              [ 02 // ARCHIVE OF SELECTED WORK ]
            </span>
            <h2
              className="text-4xl sm:text-5xl font-normal tracking-tight text-[#F5F3EE]"
              style={{ fontFamily: designDNA.typography.displayFont || 'Instrument Serif, Georgia, serif' }}
            >
              {section.title || 'Selected Projects'}
            </h2>
          </div>
          <span className="font-mono text-xs text-[#9E9B91] uppercase tracking-wider">
            INDEX: 01 — 0{projects.length}
          </span>
        </div>

        {/* Swiss Grid Numbered Items with Full-Width Horizontal Structural Rules */}
        <div className="flex flex-col">
          {projects.map((project, idx) => {
            const title = project.title || `Project 0${idx + 1}`;
            const rawTechs = project.technologies || project.tags || [];
            const techs: string[] =
              Array.isArray(rawTechs) && rawTechs.length > 0
                ? rawTechs
                : ['TypeScript', 'Next.js', 'Architecture'];
            const description =
              project.description ||
              'Engineered an end-to-end production architecture with modular component systems and high throughput.';
            const highlights = project.highlights || [];
            const liveUrl = project.liveUrl;
            const githubUrl = project.githubUrl;

            return (
              <div
                key={project.id || idx}
                className="group border-b border-[#262624] py-10 transition-colors hover:bg-[#141414]/80 flex flex-col gap-6"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  {/* Big Number Typographic Anchor */}
                  <div className="lg:col-span-2 flex items-baseline gap-2">
                    <span
                      className="text-4xl sm:text-6xl font-mono font-light tracking-tighter"
                      style={{ color: accentColor }}
                    >
                      0{idx + 1}
                    </span>
                    <span className="text-xs font-mono text-[#9E9B91]">/REF</span>
                  </div>

                  {/* Project Title & Narrative */}
                  <div className="lg:col-span-6 flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <h3
                        className="text-2xl sm:text-3xl font-normal text-[#F5F3EE] group-hover:text-[#C9A96E] transition-colors"
                        style={{ fontFamily: designDNA.typography.displayFont || 'Instrument Serif, serif' }}
                      >
                        {title}
                      </h3>
                    </div>

                    <p className="text-sm sm:text-base text-[#D6D3CC] leading-relaxed font-sans max-w-2xl">
                      {description}
                    </p>

                    {highlights.length > 0 && (
                      <div className="flex flex-col gap-1.5 pt-2">
                        {highlights.map((h, hIdx) => (
                          <div key={hIdx} className="flex items-center gap-2 text-xs font-mono text-[#9E9B91]">
                            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accentColor }} />
                            <span>{h}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Tech Stack Column & Action Links */}
                  <div className="lg:col-span-4 flex flex-col gap-4 lg:items-end">
                    <div className="flex flex-wrap lg:justify-end gap-2">
                      {techs.map((tech, tIdx) => (
                        <span
                          key={tIdx}
                          className="px-2.5 py-1 text-xs font-mono rounded bg-[#1D1D1C] border border-[#262624] text-[#D6D3CC]"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                      {githubUrl && (
                        <a
                          href={githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-3 py-1.5 rounded border border-[#262624] text-xs font-mono text-[#9E9B91] hover:text-[#F5F3EE] hover:border-[#C9A96E] transition-all"
                        >
                          <Github className="w-3.5 h-3.5" />
                          <span>Source</span>
                        </a>
                      )}

                      {liveUrl && (
                        <a
                          href={liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-3 py-1.5 rounded border text-xs font-mono transition-all"
                          style={{
                            borderColor: accentColor,
                            color: accentColor,
                          }}
                        >
                          <span>Live Demo</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
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
