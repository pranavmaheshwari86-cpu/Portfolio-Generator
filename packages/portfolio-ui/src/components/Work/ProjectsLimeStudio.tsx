import React, { useState } from 'react';
import { SectionContainer } from '../SectionContainer.js';
import type { PortfolioSection, DesignDNA } from '@portfolio-ai/types';
import { ArrowUpRight, Github, ChevronRight } from 'lucide-react';

interface ProjectsProps {
  section: PortfolioSection;
  designDNA: DesignDNA;
}

export const ProjectsLimeStudio: React.FC<ProjectsProps> = ({ section, designDNA }) => {
  const [activeIdx, setActiveIdx] = useState<number>(0);

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

  const accentLime = designDNA.colorPalette.accent || '#C7FF00';

  return (
    <SectionContainer id={section.id || 'work'} designDNA={designDNA} className="py-20">
      <div className="w-full max-w-[1440px] mx-auto flex flex-col gap-10">
        {/* Section Header */}
        <div className="flex flex-wrap items-end justify-between border-b border-[#282824] pb-6 gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-sm" style={{ backgroundColor: accentLime }} />
              <span className="font-mono text-xs uppercase tracking-widest text-[#7E8270]">
                INDEXED REPERTORY // V2
              </span>
            </div>
            <h2
              className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-[#EDEDED]"
              style={{ fontFamily: designDNA.typography.displayFont || 'Space Grotesk, sans-serif' }}
            >
              {section.title || 'Selected Work'}
            </h2>
          </div>

          <span className="font-mono text-xs text-[#7E8270] uppercase tracking-widest">
            {projects.length} SYSTEMS DEPLOYED
          </span>
        </div>

        {/* Indexed List with Number-Keyed Hover Reveals */}
        <div className="flex flex-col gap-3">
          {projects.map((project, idx) => {
            const isHovered = activeIdx === idx;
            const title = project.title || `Project 0${idx + 1}`;
            const rawTechs = project.technologies || project.tags || [];
            const techs: string[] =
              Array.isArray(rawTechs) && rawTechs.length > 0
                ? rawTechs
                : ['TypeScript', 'FastAPI', 'Next.js'];
            const description =
              project.description ||
              'High-performance production architecture built for scale, resilience, and micro-latency execution.';
            const highlights = project.highlights || [];
            const liveUrl = project.liveUrl;
            const githubUrl = project.githubUrl;

            return (
              <div
                key={project.id || idx}
                onMouseEnter={() => setActiveIdx(idx)}
                className={`p-6 sm:p-8 rounded-xl border transition-all duration-300 flex flex-col gap-6 cursor-pointer ${
                  isHovered
                    ? 'bg-[#161614] border-[#C7FF00]/60 shadow-[0_0_30px_rgba(199,255,0,0.12)]'
                    : 'bg-[#111110] border-[#282824] opacity-80 hover:opacity-100'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-baseline gap-6">
                    <span
                      className="font-mono text-2xl sm:text-3xl font-black tracking-tighter"
                      style={{ color: isHovered ? accentLime : '#7E8270' }}
                    >
                      0{idx + 1}
                    </span>
                    <h3
                      className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-[#EDEDED]"
                      style={{ fontFamily: designDNA.typography.displayFont || 'Space Grotesk, sans-serif' }}
                    >
                      {title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex flex-wrap gap-1.5">
                      {techs.slice(0, 3).map((tech, tIdx) => (
                        <span
                          key={tIdx}
                          className="px-2 py-0.5 rounded text-[11px] font-mono bg-[#20201D] text-[#A3A39E] border border-[#282824]"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <ChevronRight
                      className={`w-5 h-5 transition-transform duration-300 ${
                        isHovered ? 'rotate-90 text-[#C7FF00]' : 'text-[#7E8270]'
                      }`}
                    />
                  </div>
                </div>

                {/* Expanded Details on Active / Hover */}
                {isHovered && (
                  <div className="pt-4 border-t border-[#282824] grid grid-cols-1 md:grid-cols-12 gap-6 animate-in fade-in duration-200">
                    <div className="md:col-span-8 flex flex-col gap-3">
                      <p className="text-sm sm:text-base text-[#A3A39E] font-sans leading-relaxed">
                        {description}
                      </p>

                      {highlights.length > 0 && (
                        <div className="flex flex-wrap gap-x-6 gap-y-2 pt-2">
                          {highlights.map((h, hIdx) => (
                            <div key={hIdx} className="flex items-center gap-2 text-xs font-mono text-[#EDEDED]">
                              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accentLime }} />
                              <span>{h}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="md:col-span-4 flex items-center justify-start md:justify-end gap-3">
                      {githubUrl && (
                        <a
                          href={githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 rounded border border-[#282824] bg-[#20201D] hover:border-[#C7FF00] text-xs font-mono text-[#EDEDED] flex items-center gap-2 transition-all"
                        >
                          <Github className="w-3.5 h-3.5" />
                          <span>Code Repository</span>
                        </a>
                      )}

                      {liveUrl && (
                        <a
                          href={liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 rounded text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-md"
                          style={{
                            backgroundColor: accentLime,
                            color: '#000000',
                          }}
                        >
                          <span>Live System</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </SectionContainer>
  );
};
