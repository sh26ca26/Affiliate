import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Merchant, PayoutSchedule } from '@/entities';
import * as crypto from 'crypto';

@Injectable()
export class MerchantsService {
  constructor(
    @InjectRepository(Merchant)
    private merchantsRepository: Repository<Merchant>,
  ) {}

  async create(userId: number, data: {
    name: string;
    slug: string;
    description?: string;
    logoUrl?: string;
    websiteUrl?: string;
    commissionRate: number;
    payoutSchedule: PayoutSchedule;
  }): Promise<Merchant> {
    // Check if slug already exists
    const existingMerchant = await this.merchantsRepository.findOne({
      where: { slug: data.slug },
    });

    if (existingMerchant) {
      throw new BadRequestException('Merchant with this slug already exists');
    }

    // Generate API key and secret
    const apiKey = this.generateApiKey();
    const apiSecret = this.generateApiSecret();

    const merchant = this.merchantsRepository.create({
      user_id: userId,
      name: data.name,
      slug: data.slug,
      description: data.description,
      logo_url: data.logoUrl,
      website_url: data.websiteUrl,
      api_key: apiKey,
      api_secret: apiSecret,
      commission_rate: data.commissionRate,
      payout_schedule: data.payoutSchedule,
    });

    return this.merchantsRepository.save(merchant);
  }

  async findById(id: number): Promise<Merchant> {
    const merchant = await this.merchantsRepository.findOne({
      where: { id },
    });

    if (!merchant) {
      throw new NotFoundException('Merchant not found');
    }

    return merchant;
  }

  async findBySlug(slug: string): Promise<Merchant> {
    const merchant = await this.merchantsRepository.findOne({
      where: { slug },
    });

    if (!merchant) {
      throw new NotFoundException('Merchant not found');
    }

    return merchant;
  }

  async findByApiKey(apiKey: string): Promise<Merchant> {
    const merchant = await this.merchantsRepository.findOne({
      where: { api_key: apiKey },
    });

    if (!merchant) {
      throw new NotFoundException('Merchant not found');
    }

    return merchant;
  }

  async update(id: number, userId: number, data: Partial<Merchant>): Promise<Merchant> {
    const merchant = await this.findById(id);

    // Check authorization
    if (merchant.user_id !== userId) {
      throw new ForbiddenException('You do not have permission to update this merchant');
    }

    await this.merchantsRepository.update(id, data);
    return this.findById(id);
  }

  async delete(id: number, userId: number): Promise<void> {
    const merchant = await this.findById(id);

    // Check authorization
    if (merchant.user_id !== userId) {
      throw new ForbiddenException('You do not have permission to delete this merchant');
    }

    await this.merchantsRepository.delete(id);
  }

  async rotateApiKey(id: number, userId: number): Promise<{ apiKey: string; apiSecret: string }> {
    const merchant = await this.findById(id);

    // Check authorization
    if (merchant.user_id !== userId) {
      throw new ForbiddenException('You do not have permission to rotate API key for this merchant');
    }

    const newApiKey = this.generateApiKey();
    const newApiSecret = this.generateApiSecret();

    await this.merchantsRepository.update(id, {
      api_key: newApiKey,
      api_secret: newApiSecret,
    });

    return {
      apiKey: newApiKey,
      apiSecret: newApiSecret,
    };
  }

  async findAll(limit: number = 10, offset: number = 0) {
    const [merchants, total] = await this.merchantsRepository.findAndCount({
      take: limit,
      skip: offset,
      order: { created_at: 'DESC' },
    });

    return {
      items: merchants,
      total,
      page: Math.floor(offset / limit) + 1,
      pageSize: limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findByUserId(userId: number) {
    return this.merchantsRepository.find({
      where: { user_id: userId },
      order: { created_at: 'DESC' },
    });
  }

  private generateApiKey(): string {
    return 'sk_' + crypto.randomBytes(24).toString('hex');
  }

  private generateApiSecret(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  async verifyWebhookSignature(apiSecret: string, payload: string, signature: string): Promise<boolean> {
    const hash = crypto
      .createHmac('sha256', apiSecret)
      .update(payload)
      .digest('hex');

    return hash === signature;
  }
}

