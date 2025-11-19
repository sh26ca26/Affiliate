import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Affiliate } from '@/entities';
import * as crypto from 'crypto';

@Injectable()
export class AffiliatesService {
  constructor(
    @InjectRepository(Affiliate)
    private affiliatesRepository: Repository<Affiliate>,
  ) {}

  async create(userId: number, data?: {
    displayName?: string;
    bio?: string;
    websiteUrl?: string;
  }): Promise<Affiliate> {
    // Check if affiliate already exists for this user
    const existingAffiliate = await this.affiliatesRepository.findOne({
      where: { user_id: userId },
    });

    if (existingAffiliate) {
      throw new BadRequestException('Affiliate profile already exists for this user');
    }

    // Generate unique affiliate code
    const affiliateCode = this.generateAffiliateCode();

    const affiliate = this.affiliatesRepository.create({
      user_id: userId,
      affiliate_code: affiliateCode,
      display_name: data?.displayName,
      bio: data?.bio,
      website_url: data?.websiteUrl,
    });

    return this.affiliatesRepository.save(affiliate);
  }

  async findById(id: number): Promise<Affiliate> {
    const affiliate = await this.affiliatesRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!affiliate) {
      throw new NotFoundException('Affiliate not found');
    }

    return affiliate;
  }

  async findByUserId(userId: number): Promise<Affiliate> {
    const affiliate = await this.affiliatesRepository.findOne({
      where: { user_id: userId },
      relations: ['user'],
    });

    if (!affiliate) {
      throw new NotFoundException('Affiliate profile not found');
    }

    return affiliate;
  }

  async findByCode(code: string): Promise<Affiliate> {
    const affiliate = await this.affiliatesRepository.findOne({
      where: { affiliate_code: code },
      relations: ['user'],
    });

    if (!affiliate) {
      throw new NotFoundException('Affiliate not found');
    }

    return affiliate;
  }

  async update(id: number, data: Partial<Affiliate>): Promise<Affiliate> {
    const affiliate = await this.findById(id);

    await this.affiliatesRepository.update(id, data);
    return this.findById(id);
  }

  async updateStats(id: number, data: {
    totalClicks?: number;
    totalConversions?: number;
    totalEarnings?: number;
  }): Promise<void> {
    const updates: any = {};

    if (data.totalClicks !== undefined) {
      updates.total_clicks = data.totalClicks;
    }
    if (data.totalConversions !== undefined) {
      updates.total_conversions = data.totalConversions;
    }
    if (data.totalEarnings !== undefined) {
      updates.total_earnings = data.totalEarnings;
    }

    await this.affiliatesRepository.update(id, updates);
  }

  async findAll(limit: number = 10, offset: number = 0) {
    const [affiliates, total] = await this.affiliatesRepository.findAndCount({
      take: limit,
      skip: offset,
      relations: ['user'],
      order: { created_at: 'DESC' },
    });

    return {
      items: affiliates,
      total,
      page: Math.floor(offset / limit) + 1,
      pageSize: limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getTopAffiliates(limit: number = 10) {
    return this.affiliatesRepository.find({
      take: limit,
      relations: ['user'],
      order: { total_earnings: 'DESC' },
    });
  }

  private generateAffiliateCode(): string {
    const prefix = 'AFF';
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = crypto.randomBytes(4).toString('hex').toUpperCase();
    return `${prefix}-${timestamp}-${random}`;
  }
}

