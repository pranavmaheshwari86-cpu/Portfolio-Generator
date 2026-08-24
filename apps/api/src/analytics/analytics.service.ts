import { Injectable } from '@nestjs/common';
import { getDatabase, portfolioAnalytics } from '@portfolio-ai/database';
import { eq, desc } from 'drizzle-orm';

@Injectable()
export class AnalyticsService {
  private db = getDatabase();

  async recordVisit(portfolioId: string, device: 'desktop' | 'mobile' | 'tablet', referrer?: string) {
    const today = new Date().toISOString().split('T')[0];

    const [existing] = await this.db
      .select()
      .from(portfolioAnalytics)
      .where(eq(portfolioAnalytics.portfolioId, portfolioId))
      .limit(1);

    if (!existing) {
      await this.db.insert(portfolioAnalytics).values({
        portfolioId,
        date: today,
        pageViews: 1,
        uniqueVisitors: 1,
        deviceData: {
          desktop: device === 'desktop' ? 1 : 0,
          mobile: device === 'mobile' ? 1 : 0,
          tablet: device === 'tablet' ? 1 : 0,
        },
        referrerData: referrer ? { [referrer]: 1 } : {},
      });
    } else {
      const devData = existing.deviceData || { desktop: 0, mobile: 0, tablet: 0 };
      devData[device] = (devData[device] || 0) + 1;

      const refData = existing.referrerData || {};
      if (referrer) {
        refData[referrer] = (refData[referrer] || 0) + 1;
      }

      await this.db
        .update(portfolioAnalytics)
        .set({
          pageViews: existing.pageViews + 1,
          deviceData: devData,
          referrerData: refData,
          updatedAt: new Date(),
        })
        .where(eq(portfolioAnalytics.id, existing.id));
    }

    return { status: 'recorded' };
  }

  async getPortfolioAnalytics(portfolioId: string) {
    const records = await this.db
      .select()
      .from(portfolioAnalytics)
      .where(eq(portfolioAnalytics.portfolioId, portfolioId))
      .orderBy(desc(portfolioAnalytics.date));

    const totalViews = records.reduce((acc, r) => acc + r.pageViews, 0);
    const totalUnique = records.reduce((acc, r) => acc + r.uniqueVisitors, 0);
    const totalClicks = records.reduce((acc, r) => acc + r.ctaClicks, 0);

    return {
      summary: {
        totalViews,
        totalUnique,
        totalClicks,
      },
      history: records,
    };
  }
}
