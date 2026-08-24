import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { getDatabase, generations } from '@portfolio-ai/database';
import { eq, desc } from 'drizzle-orm';
import { ApiAiService } from '../ai/ai.service.js';
import { ProfilesService } from '../profiles/profiles.service.js';
import { PortfoliosService } from '../portfolios/portfolios.service.js';
import type { EnhancePromptInput } from '@portfolio-ai/schemas';
import type { PortfolioSchema } from '@portfolio-ai/types';
import { MemoryStore } from '../common/memory-store.js';

@Injectable()
export class GenerationsService {
  private db = getDatabase();

  constructor(
    private aiService: ApiAiService,
    private profilesService: ProfilesService,
    private portfoliosService: PortfoliosService
  ) {}

  async startFullGeneration(userId: string, input: EnhancePromptInput) {
    const profileRecord = await this.profilesService.getProfileByUserId(userId);
    const profile = profileRecord.profileData;

    const genId = `gen-${Date.now().toString(36)}`;

    // 2. Enhance prompt
    const enhancedResult = await this.aiService.enhancePrompt(input, profile);
    const enhancedSpec = enhancedResult.spec;

    // 3. Generate Design DNA
    const designResult = await this.aiService.generateDesignDNA(enhancedSpec, profile);
    const designDNA = designResult.designDNA;

    // 4. Generate Portfolio Schema & run QA
    const portfolioResult = await this.aiService.generatePortfolio(
      userId,
      profile,
      enhancedSpec,
      designDNA
    );

    const generatedSchema = portfolioResult.portfolio as PortfolioSchema;
    generatedSchema.status = 'DRAFT';
    const qaResult = portfolioResult.qa;

    // 5. Persist the generated portfolio
    const savedPortfolio = await this.portfoliosService.createPortfolio(userId, generatedSchema);

    // Total token & cost calculation
    const totalInputTokens =
      enhancedResult.usage.inputTokens +
      designResult.usage.inputTokens +
      portfolioResult.usage.inputTokens;
    const totalOutputTokens =
      enhancedResult.usage.outputTokens +
      designResult.usage.outputTokens +
      portfolioResult.usage.outputTokens;
    const totalLatency =
      enhancedResult.usage.latencyMs +
      designResult.usage.latencyMs +
      portfolioResult.usage.latencyMs;
    const totalCost = (
      enhancedResult.usage.estimatedCostUsd +
      designResult.usage.estimatedCostUsd +
      portfolioResult.usage.estimatedCostUsd
    ).toFixed(4);

    const metrics = {
      totalTokens: totalInputTokens + totalOutputTokens,
      latencyMs: totalLatency,
      estimatedCostUsd: totalCost,
    };

    MemoryStore.generations.set(genId, {
      id: genId,
      userId,
      portfolioId: savedPortfolio.id,
      status: 'COMPLETED',
      rawPrompt: input.rawPrompt,
      provider: 'multi-tier',
      model: 'gemini/gpt4o/claude',
      inputTokens: totalInputTokens,
      outputTokens: totalOutputTokens,
      latencyMs: totalLatency,
      estimatedCostUsd: totalCost,
      qaResult,
      createdAt: new Date(),
    });

    try {
      await this.db.insert(generations).values({
        id: genId as unknown as undefined,
        userId,
        portfolioId: savedPortfolio.id,
        status: 'COMPLETED',
        rawPrompt: input.rawPrompt,
        enhancedPrompt: enhancedSpec,
        provider: 'ai-orchestrator',
        model: 'multi-tier',
        inputTokens: totalInputTokens,
        outputTokens: totalOutputTokens,
        latencyMs: totalLatency,
        estimatedCostUsd: totalCost,
        qaResult,
      });
    } catch {}

    return {
      generationId: genId,
      status: 'COMPLETED',
      portfolio: savedPortfolio,
      qaResult,
      metrics,
    };
  }

  async getUserGenerations(userId: string) {
    try {
      return await this.db
        .select()
        .from(generations)
        .where(eq(generations.userId, userId))
        .orderBy(desc(generations.createdAt));
    } catch {
      return Array.from(MemoryStore.generations.values()).filter((g) => g.userId === userId);
    }
  }

  async getGenerationById(userId: string, id: string) {
    try {
      const [gen] = await this.db
        .select()
        .from(generations)
        .where(eq(generations.id, id))
        .limit(1);

      if (gen && gen.userId === userId) return gen;
    } catch {}

    const mem = MemoryStore.generations.get(id);
    if (!mem || mem.userId !== userId) throw new NotFoundException('Generation record not found');
    return mem;
  }
}
