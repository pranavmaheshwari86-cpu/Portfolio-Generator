import { Injectable, NotFoundException } from '@nestjs/common';
import { getDatabase, professionalProfiles } from '@portfolio-ai/database';
import { eq } from 'drizzle-orm';
import type { ProfessionalProfileInput } from '@portfolio-ai/schemas';
import type { ProfessionalProfile } from '@portfolio-ai/types';
import { MemoryStore } from '../common/memory-store.js';

@Injectable()
export class ProfilesService {
  private db = getDatabase();

  async getProfileByUserId(userId: string) {
    try {
      const [profile] = await this.db
        .select()
        .from(professionalProfiles)
        .where(eq(professionalProfiles.userId, userId))
        .limit(1);

      if (profile) return profile;
    } catch {}

    const mem = MemoryStore.profiles.get(userId);
    if (mem) return mem;

    // Return a default complete mock profile so user can immediately generate if needed
    const defaultProfile: ProfessionalProfile = {
      name: 'Alex Rivera',
      headline: 'Senior Full Stack & Distributed Systems Engineer',
      profession: 'Software Engineer',
      seniority: 'Senior',
      industries: ['SaaS', 'Cloud Infrastructure', 'FinTech'],
      summary: 'Passionate software architect building high-throughput microservices, realtime web apps, and AI-powered interfaces.',
      socials: {
        github: 'https://github.com/alexrivera',
        linkedin: 'https://linkedin.com/in/alexrivera',
        twitter: 'https://x.com/alexrivera',
      },
      skills: [
        { category: 'Frontend', items: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion'] },
        { category: 'Backend', items: ['Node.js', 'NestJS', 'Go', 'PostgreSQL', 'Redis'] },
      ],
      experience: [
        {
          id: 'exp-1',
          role: 'Lead Full Stack Engineer',
          company: 'Veloce Technologies',
          startDate: '2022-03',
          current: true,
          description: 'Architected distributed event-driven platform handling 50M+ requests daily with 99.99% uptime.',
          highlights: ['Reduced API p95 latency by 42% through caching and query optimization'],
        },
      ],
      projects: [
        {
          id: 'proj-1',
          title: 'HyperStream Real-Time Analytics',
          description: 'High-throughput stream processing pipeline and real-time visualization dashboard.',
          technologies: ['React', 'TypeScript', 'Go', 'Kafka', 'ClickHouse'],
          highlights: ['Sub-100ms real-time metric updates', '2,400+ GitHub Stars'],
          liveUrl: 'https://hyperstream.example.dev',
          githubUrl: 'https://github.com/alexrivera/hyperstream',
        },
      ],
      education: [
        {
          id: 'edu-1',
          degree: 'B.S. in Computer Science',
          institution: 'UC Berkeley',
        },
      ],
      personality: ['technical', 'curious', 'builder', 'innovative'],
      targetAudience: ['Engineering Leaders', 'Founders', 'Tech Recruiters'],
      brandPositioning: 'Senior architect combining deep systems engineering with polished design craft.',
      portfolioPriority: ['projects', 'skills', 'experience'],
      groundedFacts: [
        { claim: 'Lead Full Stack Engineer at Veloce Technologies', source: 'resume', confidence: 1.0 },
      ],
    };

    const mockRecord = {
      id: `prof-${Date.now().toString(36)}`,
      userId,
      profession: defaultProfile.profession,
      seniority: defaultProfile.seniority,
      headline: defaultProfile.headline,
      summary: defaultProfile.summary,
      profileData: defaultProfile,
    };
    MemoryStore.profiles.set(userId, mockRecord);
    return mockRecord;
  }

  async updateProfile(userId: string, data: ProfessionalProfileInput) {
    const memProfile = {
      id: `prof-${Date.now().toString(36)}`,
      userId,
      profession: data.profession,
      seniority: data.seniority,
      headline: data.headline,
      summary: data.summary,
      profileData: data as ProfessionalProfile,
    };
    MemoryStore.profiles.set(userId, memProfile);

    try {
      const [updated] = await this.db
        .update(professionalProfiles)
        .set({
          profession: data.profession,
          seniority: data.seniority,
          headline: data.headline,
          summary: data.summary,
          profileData: data as ProfessionalProfile,
          updatedAt: new Date(),
        })
        .where(eq(professionalProfiles.userId, userId))
        .returning();

      if (updated) return updated;
    } catch {}

    return memProfile;
  }
}
