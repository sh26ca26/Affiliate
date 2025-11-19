import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Link, LinkType, Click } from '@/entities';
import * as crypto from 'crypto';

@Injectable()
export class LinksService {
  constructor(
    @InjectRepository(Link)
    private linksRepository: Repository<Link>,
    @InjectRepository(Click)
    private clicksRepository: Repository<Click>,
  ) {}

  async create(data: {
    merchantId: number;
    affiliateId?: number;
    type: LinkType;
    targetId?: string;
    targetUrl: string;
    title?: string;
    description?: string;
    utmParams?: Record<string, string>;
  }): Promise<Link> {
    // Generate unique slug
    const slug = this.generateSlug();

    const link = this.linksRepository.create({
      merchant_id: data.merchantId,
      affiliate_id: data.affiliateId,
      type: data.type,
      target_id: data.targetId,
      target_url: data.targetUrl,
      slug: slug,
      title: data.title,
      description: data.description,
      utm_params: data.utmParams || {},
    });

    return this.linksRepository.save(link);
  }

  async findById(id: number): Promise<Link> {
    const link = await this.linksRepository.findOne({
      where: { id },
      relations: ['merchant', 'affiliate'],
    });

    if (!link) {
      throw new NotFoundException('Link not found');
    }

    return link;
  }

  async findBySlug(slug: string): Promise<Link> {
    const link = await this.linksRepository.findOne({
      where: { slug },
      relations: ['merchant', 'affiliate'],
    });

    if (!link) {
      throw new NotFoundException('Link not found');
    }

    return link;
  }

  async recordClick(slug: string, data: {
    ipAddress?: string;
    userAgent?: string;
    referrer?: string;
    country?: string;
    city?: string;
    deviceType?: string;
    browser?: string;
    os?: string;
    utm?: Record<string, string>;
    customParams?: Record<string, any>;
    sessionId?: string;
    fingerprint?: string;
  }): Promise<{ redirectUrl: string; clickId: number }> {
    const link = await this.findBySlug(slug);

    // Increment click count
    await this.linksRepository.update(link.id, {
      total_clicks: () => 'total_clicks + 1',
    });

    // Record click
    const click = this.clicksRepository.create({
      link_id: link.id,
      affiliate_id: link.affiliate_id,
      merchant_id: link.merchant_id,
      ip_address: data.ipAddress,
      user_agent: data.userAgent,
      referrer: data.referrer,
      country: data.country,
      city: data.city,
      device_type: data.deviceType,
      browser: data.browser,
      os: data.os,
      utm: data.utm || {},
      custom_params: data.customParams || {},
      session_id: data.sessionId,
      fingerprint: data.fingerprint,
    });

    const savedClick = await this.clicksRepository.save(click);

    return {
      redirectUrl: link.target_url,
      clickId: savedClick.id,
    };
  }

  async update(id: number, merchantId: number, data: Partial<Link>): Promise<Link> {
    const link = await this.findById(id);

    // Check authorization
    if (link.merchant_id !== merchantId) {
      throw new ForbiddenException('You do not have permission to update this link');
    }

    await this.linksRepository.update(id, data);
    return this.findById(id);
  }

  async delete(id: number, merchantId: number): Promise<void> {
    const link = await this.findById(id);

    // Check authorization
    if (link.merchant_id !== merchantId) {
      throw new ForbiddenException('You do not have permission to delete this link');
    }

    await this.linksRepository.delete(id);
  }

  async findByMerchantId(merchantId: number, limit: number = 10, offset: number = 0) {
    const [links, total] = await this.linksRepository.findAndCount({
      where: { merchant_id: merchantId },
      take: limit,
      skip: offset,
      relations: ['affiliate'],
      order: { created_at: 'DESC' },
    });

    return {
      items: links,
      total,
      page: Math.floor(offset / limit) + 1,
      pageSize: limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findByAffiliateId(affiliateId: number, limit: number = 10, offset: number = 0) {
    const [links, total] = await this.linksRepository.findAndCount({
      where: { affiliate_id: affiliateId },
      take: limit,
      skip: offset,
      relations: ['merchant'],
      order: { created_at: 'DESC' },
    });

    return {
      items: links,
      total,
      page: Math.floor(offset / limit) + 1,
      pageSize: limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getClicksByLinkId(linkId: number, limit: number = 10, offset: number = 0) {
    const [clicks, total] = await this.clicksRepository.findAndCount({
      where: { link_id: linkId },
      take: limit,
      skip: offset,
      order: { created_at: 'DESC' },
    });

    return {
      items: clicks,
      total,
      page: Math.floor(offset / limit) + 1,
      pageSize: limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  private generateSlug(): string {
    const random = crypto.randomBytes(6).toString('hex');
    return `link_${Date.now()}_${random}`;
  }
}

