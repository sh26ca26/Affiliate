import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Click, Conversion, Commission, Link } from '@/entities';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Click)
    private clicksRepository: Repository<Click>,
    @InjectRepository(Conversion)
    private conversionsRepository: Repository<Conversion>,
    @InjectRepository(Commission)
    private commissionsRepository: Repository<Commission>,
    @InjectRepository(Link)
    private linksRepository: Repository<Link>,
  ) {}

  /**
   * Get dashboard statistics for merchant
   */
  async getMerchantDashboard(merchantId: number, startDate?: Date, endDate?: Date) {
    const dateFilter = startDate && endDate ? { created_at: Between(startDate, endDate) } : {};

    // Get clicks
    const clicks = await this.clicksRepository.find({
      where: { merchant_id: merchantId, ...dateFilter },
    });

    // Get conversions
    const conversions = await this.conversionsRepository.find({
      where: { merchant_id: merchantId, ...dateFilter },
    });

    // Get commissions
    const commissions = await this.commissionsRepository.find({
      where: { merchant_id: merchantId, ...dateFilter },
    });

    const totalClicks = clicks.length;
    const totalConversions = conversions.length;
    const conversionRate = totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0;
    const totalCommissions = commissions.reduce(
      (sum, c) => sum + parseFloat(c.amount.toString()),
      0,
    );

    return {
      totalClicks,
      totalConversions,
      conversionRate: parseFloat(conversionRate.toFixed(2)),
      totalCommissions: parseFloat(totalCommissions.toFixed(2)),
      averageOrderValue:
        totalConversions > 0
          ? parseFloat(
              (
                conversions.reduce((sum, c) => sum + parseFloat(c.amount.toString()), 0) /
                totalConversions
              ).toFixed(2),
            )
          : 0,
    };
  }

  /**
   * Get dashboard statistics for affiliate
   */
  async getAffiliateDashboard(affiliateId: number, startDate?: Date, endDate?: Date) {
    const dateFilter = startDate && endDate ? { created_at: Between(startDate, endDate) } : {};

    // Get clicks
    const clicks = await this.clicksRepository.find({
      where: { affiliate_id: affiliateId, ...dateFilter },
    });

    // Get conversions
    const conversions = await this.conversionsRepository.find({
      where: { affiliate_id: affiliateId, ...dateFilter },
    });

    // Get commissions
    const commissions = await this.commissionsRepository.find({
      where: { affiliate_id: affiliateId, ...dateFilter },
    });

    const totalClicks = clicks.length;
    const totalConversions = conversions.length;
    const clickThroughRate = totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0;
    const totalEarnings = commissions.reduce(
      (sum, c) => sum + parseFloat(c.amount.toString()),
      0,
    );

    return {
      totalClicks,
      totalConversions,
      clickThroughRate: parseFloat(clickThroughRate.toFixed(2)),
      totalEarnings: parseFloat(totalEarnings.toFixed(2)),
      averageCommission:
        totalConversions > 0
          ? parseFloat((totalEarnings / totalConversions).toFixed(2))
          : 0,
    };
  }

  /**
   * Get top performing links
   */
  async getTopLinks(merchantId: number, limit: number = 10) {
    const links = await this.linksRepository.find({
      where: { merchant_id: merchantId },
      take: limit,
      order: { total_conversions: 'DESC' },
    });

    return links.map((link) => ({
      id: link.id,
      slug: link.slug,
      title: link.title,
      totalClicks: link.total_clicks,
      totalConversions: link.total_conversions,
      conversionRate:
        link.total_clicks > 0
          ? parseFloat(((link.total_conversions / link.total_clicks) * 100).toFixed(2))
          : 0,
    }));
  }

  /**
   * Get clicks over time (daily)
   */
  async getClicksOverTime(merchantId: number, days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const clicks = await this.clicksRepository.find({
      where: {
        merchant_id: merchantId,
        created_at: Between(startDate, new Date()),
      },
      order: { created_at: 'ASC' },
    });

    // Group by day
    const grouped: Record<string, number> = {};
    clicks.forEach((click) => {
      const date = click.created_at.toISOString().split('T')[0];
      grouped[date] = (grouped[date] || 0) + 1;
    });

    return Object.entries(grouped).map(([date, count]) => ({
      date,
      clicks: count,
    }));
  }

  /**
   * Get conversions over time (daily)
   */
  async getConversionsOverTime(merchantId: number, days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const conversions = await this.conversionsRepository.find({
      where: {
        merchant_id: merchantId,
        created_at: Between(startDate, new Date()),
      },
      order: { created_at: 'ASC' },
    });

    // Group by day
    const grouped: Record<string, number> = {};
    conversions.forEach((conversion) => {
      const date = conversion.created_at.toISOString().split('T')[0];
      grouped[date] = (grouped[date] || 0) + 1;
    });

    return Object.entries(grouped).map(([date, count]) => ({
      date,
      conversions: count,
    }));
  }

  /**
   * Get revenue over time (daily)
   */
  async getRevenueOverTime(merchantId: number, days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const conversions = await this.conversionsRepository.find({
      where: {
        merchant_id: merchantId,
        created_at: Between(startDate, new Date()),
      },
      order: { created_at: 'ASC' },
    });

    // Group by day
    const grouped: Record<string, number> = {};
    conversions.forEach((conversion) => {
      const date = conversion.created_at.toISOString().split('T')[0];
      grouped[date] = (grouped[date] || 0) + parseFloat(conversion.amount.toString());
    });

    return Object.entries(grouped).map(([date, revenue]) => ({
      date,
      revenue: parseFloat(revenue.toFixed(2)),
    }));
  }

  /**
   * Get traffic sources (referrers)
   */
  async getTrafficSources(merchantId: number, limit: number = 10) {
    const clicks = await this.clicksRepository.find({
      where: { merchant_id: merchantId },
    });

    const grouped: Record<string, number> = {};
    clicks.forEach((click) => {
      const referrer = click.referrer || 'Direct';
      grouped[referrer] = (grouped[referrer] || 0) + 1;
    });

    return Object.entries(grouped)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([source, count]) => ({
        source,
        clicks: count,
      }));
  }

  /**
   * Get device breakdown
   */
  async getDeviceBreakdown(merchantId: number) {
    const clicks = await this.clicksRepository.find({
      where: { merchant_id: merchantId },
    });

    const grouped: Record<string, number> = {};
    clicks.forEach((click) => {
      const device = click.device_type || 'Unknown';
      grouped[device] = (grouped[device] || 0) + 1;
    });

    return Object.entries(grouped).map(([device, count]) => ({
      device,
      clicks: count,
      percentage: parseFloat(((count / clicks.length) * 100).toFixed(2)),
    }));
  }
}

