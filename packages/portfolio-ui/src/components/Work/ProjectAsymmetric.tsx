import React from 'react';
import { SectionContainer } from '../SectionContainer.js';
import type { PortfolioSection, DesignDNA } from '@portfolio-ai/types';
import { cn } from '../../utils.js';
import { ExternalLink, Github, ArrowUpRight, Code2 } from 'lucide-react';

interface ProjectProps {
  section: PortfolioSection;
  designDNA: DesignDNA;
}

export const ProjectAsymmetric: React.FC<ProjectProps> = ({ section, designDNA }) => {
  const content = section.content as {
    projects?: Array<{
      id?: string;
      title: string;
      description?: string;
      technologies?: string[];
      tags?: string[];
      highlights?: string[];
      metrics?: string;
      liveUrl?: string;
      githubUrl?: string;
      link?: string;
      image?: string;
    }>;
  };

  const rawProjects = Array.isArray(content?.projects) ? content.projects : [];

  // If no projects provided in content, generate 2 canonical showcase items
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

  return (
    <SectionContainer id={section.id || 'work'} designDNA={designDNA}>
      <div className="flex flex-col gap-12 max-w-[1440px] mx-auto w-full">
        {/* Section Header */}
        <div className="flex flex-col items-start gap-3">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#1c1c1a] border border-[#2a2a29] text-[#c7f16a] text-xs font-mono">
            <Code2 className="w-3.5 h-3.5" />
            <span className="uppercase tracking-widest font-semibold">ENGINEERING PORTFOLIO</span>
          </div>
          <h2
            className="text-3xl sm:text-5xl font-bold tracking-tight text-[#e5e2df]"
            style={{ fontFamily: designDNA.typography.displayFont || 'Instrument Serif, serif' }}
          >
            {section.title || 'Selected Work'}
          </h2>
          {section.subtitle && (
            <p className="text-base text-[#c4c9b3] max-w-2xl font-sans leading-relaxed">
              {section.subtitle}
            </p>
          )}
        </div>

        {/* Bento / Grid Projects */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project, idx) => {
            const title = project.title || `Project 0${idx + 1}`;
            const rawTechs = project.technologies || project.tags || [];
            const techs: string[] =
              Array.isArray(rawTechs) && rawTechs.length > 0
                ? rawTechs
                : ['TypeScript', 'React', 'Node.js', 'Architecture'];

            const description =
              project.description && project.description.trim().length > 15
                ? project.description
                : `Engineered an end-to-end production solution for ${title} with modular architecture, robust state management, and high-performance APIs.`;

            const rawHighlights = project.highlights || (project.metrics ? [project.metrics] : []);
            const highlights: string[] = Array.isArray(rawHighlights) ? rawHighlights : [];
            const liveUrl = project.liveUrl || project.link;
            const githubUrl = project.githubUrl;

            return (
              <div
                key={project.id || idx}
                className="group relative rounded-2xl border border-[#2a2a29] bg-[#1c1c1a] hover:border-[#c7f16a]/50 p-8 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between overflow-hidden shadow-xl"
              >
                {/* Ambient Card Watermark Number */}
                <div className="absolute top-2 right-4 text-7xl font-mono font-black text-[#2a2a29]/30 pointer-events-none select-none">
                  0{idx + 1}
                </div>

                <div className="flex flex-col gap-4 relative z-10">
                  {/* Card Header & Links */}
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-2xl font-bold font-sans text-[#e5e2df] group-hover:text-[#c7f16a] transition-colors leading-tight">
                      {title}
                    </h3>
                    <div className="flex items-center gap-2 shrink-0">
                      {githubUrl && (
                        <a
                          href={githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg bg-[#20201e] border border-[#2a2a29] text-[#8e937f] hover:text-[#e5e2df] hover:border-[#8e937f] transition-all"
                          aria-label="GitHub Repository"
                        >
                          <Github className="w-4 h-4" />
                        </a>
                      )}
                      {liveUrl && (
                        <a
                          href={liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg bg-[#c7f16a]/10 border border-[#c7f16a]/30 text-[#c7f16a] hover:bg-[#c7f16a] hover:text-[#141f00] transition-all"
                          aria-label="Live Project Demo"
                        >
                          <ArrowUpRight className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Project Description */}
                  <p className="text-sm text-[#c4c9b3] font-sans leading-relaxed">
                    {description}
                  </p>

                  {/* Highlights Bullet List */}
                  {highlights.length > 0 && (
                    <ul className="flex flex-col gap-2 pt-2">
                      {highlights.map((highlight, hIdx) => (
                        <li key={hIdx} className="text-xs text-[#8e937f] flex items-center gap-2 font-sans">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#c7f16a] shrink-0" />
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Tech Stack Chips */}
                {techs.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-6 mt-6 border-t border-[#2a2a29] relative z-10">
                    {techs.map((tech, tIdx) => (
                      <span
                        key={tIdx}
                        className="text-xs px-2.5 py-1 rounded-md font-mono bg-[#20201e] border border-[#2a2a29] text-[#c4c9b3]"
                      >
                        {tech}
                      </span>
                    ))}
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
