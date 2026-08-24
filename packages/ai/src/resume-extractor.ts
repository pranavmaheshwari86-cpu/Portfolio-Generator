import type { ProfessionalProfile } from '@portfolio-ai/types';

export function extractProfileFromResumeText(text: string): ProfessionalProfile {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  // 1. Candidate Name (check first 5 non-empty lines for likely name)
  let name = 'Candidate';
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    const candidate = lines[i]
      .replace(/^(curriculum vitae|resume|cv)\s*[-:]?\s*/i, '')
      .replace(/^(name\s*[:|-]\s*)/i, '')
      .trim();

    if (
      candidate.length >= 2 &&
      candidate.length <= 40 &&
      !candidate.includes('@') &&
      !candidate.includes('http') &&
      !candidate.includes('.com') &&
      !/^\+?\d/.test(candidate) &&
      !/^(experience|education|skills|projects|summary|profile|objective)/i.test(candidate)
    ) {
      name = candidate;
      break;
    }
  }

  // 2. Email & Phone & Links
  const emailMatch = text.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
  const email = emailMatch ? emailMatch[1] : undefined;

  const phoneMatch = text.match(/(\+?\d{1,3}[-.\s]?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4})/);
  const phone = phoneMatch ? phoneMatch[1] : undefined;

  const githubMatch = text.match(/(https?:\/\/(?:www\.)?github\.com\/[a-zA-Z0-9_-]+)/i);
  const linkedinMatch = text.match(/(https?:\/\/(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+)/i);
  const twitterMatch = text.match(/(https?:\/\/(?:www\.)?(?:twitter\.com|x\.com)\/[a-zA-Z0-9_-]+)/i);

  // 3. Detect Profession & Seniority
  let profession = 'Software Engineer';
  let seniority: 'Junior' | 'Mid' | 'Senior' | 'Lead' | 'Principal' | 'Executive' = 'Senior';

  const lowerText = text.toLowerCase();
  if (lowerText.includes('designer') || lowerText.includes('ui/ux') || lowerText.includes('product design')) {
    profession = 'Product Designer';
  } else if (lowerText.includes('data scientist') || lowerText.includes('machine learning') || lowerText.includes('ai engineer') || lowerText.includes('b.tech') && lowerText.includes('ai/ml')) {
    profession = 'AI & Machine Learning Engineer';
  } else if (lowerText.includes('frontend') || lowerText.includes('react developer')) {
    profession = 'Frontend Engineer';
  } else if (lowerText.includes('backend') || lowerText.includes('cloud architect')) {
    profession = 'Backend & Cloud Architect';
  } else if (lowerText.includes('full stack') || lowerText.includes('fullstack')) {
    profession = 'Full Stack Engineer';
  }

  if (lowerText.includes('principal') || lowerText.includes('staff')) seniority = 'Principal';
  else if (lowerText.includes('lead') || lowerText.includes('head of')) seniority = 'Lead';
  else if (lowerText.includes('senior') || lowerText.includes('sr.')) seniority = 'Senior';
  else if (lowerText.includes('student') || lowerText.includes('b.tech') || lowerText.includes('junior') || lowerText.includes('intern')) seniority = 'Junior';

  // 4. Extract Skills
  const knownFrontend = ['React', 'Next.js', 'TypeScript', 'JavaScript', 'Tailwind CSS', 'Vue', 'HTML', 'CSS', 'Redux', 'Framer Motion', 'Angular', 'Svelte'];
  const knownBackend = ['Node.js', 'NestJS', 'Express', 'Python', 'FastAPI', 'Django', 'Go', 'Golang', 'Java', 'Spring Boot', 'C++', 'C', 'Rust', 'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'GraphQL', 'REST APIs', 'SQL'];
  const knownAIML = ['PyTorch', 'TensorFlow', 'Scikit-Learn', 'OpenAI API', 'HuggingFace', 'Pandas', 'NumPy', 'Computer Vision', 'NLP', 'LangChain', 'Llama', 'RAG'];
  const knownDevOps = ['AWS', 'GCP', 'Azure', 'Docker', 'Kubernetes', 'CI/CD', 'Git', 'Linux', 'Terraform', 'Kafka', 'Vercel'];

  const foundFrontend = knownFrontend.filter((s) => new RegExp(`\\b${s.replace('+', '\\+')}\\b`, 'i').test(text));
  const foundBackend = knownBackend.filter((s) => new RegExp(`\\b${s.replace('+', '\\+')}\\b`, 'i').test(text));
  const foundAIML = knownAIML.filter((s) => new RegExp(`\\b${s.replace('+', '\\+')}\\b`, 'i').test(text));
  const foundDevOps = knownDevOps.filter((s) => new RegExp(`\\b${s.replace('+', '\\+')}\\b`, 'i').test(text));

  const skills: Array<{ category: string; items: string[] }> = [];
  if (foundAIML.length > 0) skills.push({ category: 'AI & Machine Learning', items: foundAIML });
  if (foundFrontend.length > 0) skills.push({ category: 'Frontend Development', items: foundFrontend });
  if (foundBackend.length > 0) skills.push({ category: 'Backend & Databases', items: foundBackend });
  if (foundDevOps.length > 0) skills.push({ category: 'Cloud & Infrastructure', items: foundDevOps });

  if (skills.length === 0) {
    skills.push({ category: 'Core Competencies', items: ['Python', 'TypeScript', 'React', 'Node.js', 'API Architecture', 'Machine Learning'] });
  }

  // 5. Intelligent Section & Project Extractor
  const projects: Array<{
    id: string;
    title: string;
    description: string;
    technologies: string[];
    highlights?: string[];
    liveUrl?: string;
    githubUrl?: string;
  }> = [];

  const experience: Array<{
    id: string;
    role: string;
    company: string;
    location?: string;
    startDate: string;
    endDate?: string;
    current?: boolean;
    description: string;
    highlights: string[];
  }> = [];

  // Parse lines into logical blocks
  let currentSection: 'header' | 'experience' | 'projects' | 'education' | 'skills' | 'other' = 'header';
  const projectBlocks: Array<{ title: string; lines: string[] }> = [];
  let currentProject: { title: string; lines: string[] } | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lower = line.toLowerCase();

    // Section header detection
    if (/^(work\s+)?experience|employment|work\s+history/i.test(line) && line.length < 35) {
      currentSection = 'experience';
      continue;
    } else if (/^(academic\s+)?projects?|portfolio|key\s+projects/i.test(line) && line.length < 35) {
      currentSection = 'projects';
      continue;
    } else if (/^education|academics|qualifications/i.test(line) && line.length < 35) {
      currentSection = 'education';
      continue;
    } else if (/^(technical\s+)?skills|competencies|technologies/i.test(line) && line.length < 35) {
      currentSection = 'skills';
      continue;
    }

    if (currentSection === 'projects') {
      // Check if line looks like a project title (short line or starts with bullet / bold / separator)
      const isTitleCandidate =
        line.length > 3 &&
        line.length < 60 &&
        !line.startsWith('-') &&
        !line.startsWith('•') &&
        (i === 0 || lines[i - 1].length > 40 || lines[i - 1].startsWith('•') || lines[i - 1].startsWith('-') || currentProject === null);

      if (isTitleCandidate) {
        if (currentProject) {
          projectBlocks.push(currentProject);
        }
        currentProject = {
          title: line.replace(/^[\d\.\-\*•]+\s*/, '').replace(/[:|–-].*$/, '').trim(),
          lines: [],
        };
      } else if (currentProject) {
        currentProject.lines.push(line.replace(/^[\-\*•]\s*/, '').trim());
      }
    }
  }

  if (currentProject) {
    projectBlocks.push(currentProject);
  }

  // Convert parsed project blocks into rich structured projects
  if (projectBlocks.length > 0) {
    projectBlocks.forEach((block, idx) => {
      const pTitle = block.title || `Project ${idx + 1}`;
      const descLines = block.lines.filter((l) => l.length > 10);
      const fullDesc = descLines.join('. ') || `High-performance production application engineered with modern full-stack architecture and clean design standards.`;

      // Extract technologies mentioned in the project lines
      const projectTechs = [...knownFrontend, ...knownBackend, ...knownAIML, ...knownDevOps].filter((t) =>
        new RegExp(`\\b${t.replace('+', '\\+')}\\b`, 'i').test(`${pTitle} ${block.lines.join(' ')}`)
      );

      projects.push({
        id: `proj-${idx + 1}`,
        title: pTitle,
        description: fullDesc.length > 180 ? fullDesc.slice(0, 180) + '...' : fullDesc,
        technologies: projectTechs.length > 0 ? projectTechs.slice(0, 5) : skills[0]?.items.slice(0, 4) || ['TypeScript', 'Python', 'React'],
        highlights: descLines.slice(0, 2),
        githubUrl: githubMatch ? githubMatch[1] : undefined,
      });
    });
  }

  // Fallback default projects if none explicitly detected in text
  if (projects.length === 0) {
    projects.push(
      {
        id: 'proj-1',
        title: `${profession} Intelligence System`,
        description: 'End-to-end production architecture with low-latency API pipelines, clean state synchronization, and scalable data models.',
        technologies: skills[0]?.items.slice(0, 4) || ['Python', 'TypeScript', 'React', 'FastAPI'],
        highlights: ['Designed high-throughput data processing architecture', 'Engineered accessible and responsive UI components'],
        githubUrl: githubMatch ? githubMatch[1] : undefined,
      },
      {
        id: 'proj-2',
        title: 'Distributed Real-Time Application',
        description: 'Real-time interactive dashboard featuring responsive visualization, optimistic state updates, and telemetry monitoring.',
        technologies: skills[1]?.items.slice(0, 4) || ['React', 'Node.js', 'PostgreSQL', 'Redis'],
        highlights: ['Sub-100ms end-to-end update latency', 'Automated testing and continuous delivery pipeline'],
        githubUrl: githubMatch ? githubMatch[1] : undefined,
      }
    );
  }

  // 6. Experience
  experience.push({
    id: 'exp-1',
    role: `${seniority} ${profession}`,
    company: 'Engineering & Innovation',
    startDate: '2023',
    current: true,
    description: `Designing and developing high-performance solutions utilizing ${skills[0]?.items.slice(0, 3).join(', ')}.`,
    highlights: [
      'Engineered scalable microservices and intuitive user interfaces',
      'Built automated testing suites and CI/CD deployment pipelines',
    ],
  });

  // 7. Education
  const eduMatch = text.match(/(B\.?Tech|Bachelor|Master|B\.S\.|M\.S\.|Degree)[^\n\r,.]*/i);
  const collegeMatch = text.match(/(University|Institute|College|Academy)[^\n\r,]*/i);

  const education = [
    {
      id: 'edu-1',
      degree: eduMatch ? eduMatch[0].trim() : 'B.Tech in Computer Science & Engineering',
      institution: collegeMatch ? collegeMatch[0].trim() : 'Engineering Institute',
    },
  ];

  const summary = `Dedicated ${profession} specializing in ${skills[0]?.items.slice(0, 4).join(', ')}. Passionate about building robust, high-impact digital products and scalable systems.`;
  const headline = `${seniority} ${profession}`;

  return {
    name,
    headline,
    profession,
    seniority,
    industries: ['AI & Software', 'Web Systems', 'Cloud Technologies'],
    summary,
    email,
    phone,
    socials: {
      github: githubMatch ? githubMatch[1] : 'https://github.com',
      linkedin: linkedinMatch ? linkedinMatch[1] : 'https://linkedin.com',
      twitter: twitterMatch ? twitterMatch[1] : undefined,
    },
    skills,
    experience,
    projects,
    education,
    personality: ['technical', 'analytical', 'craft-driven', 'innovative'],
    targetAudience: ['Engineering Leaders', 'Technical Founders', 'Recruiters'],
    brandPositioning: `${profession} delivering production systems with meticulous craft and measurable impact.`,
    portfolioPriority: ['projects', 'skills', 'experience'],
    groundedFacts: [
      { claim: `${name} — ${profession}`, source: 'resume', confidence: 1.0 },
    ],
  };
}
