import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Conversion, ConversionStatus, Link } from '@/entities';

@Injectable()
export class ConversionsService {
  constructor(
    @InjectRepository(Conversion)
    private conversionsRepository: Repository<Conversion>,
    @InjectRepository(Link)
    private linksRepository: Repository<Link>,
  ) {}

  async create(data: {
    orderId: string;
    linkId?: number;
    affiliateId?: number;
    merchantId: number;
    amount: number;
    currency: string;
    customerEmail?: string;
    metadata?: Record<string, any>;
  }): Promise<Conversion> {
    // Check for duplicate order ID
    const existingConversion = await this.conversionsRepository.findOne({
      where: {
        order_id: data.orderId,
        merchant_id: data.merchantId,
      },
    });

    if (existingConversion) {
      throw new BadRequestException('Conversion with this order ID already exists');
    }

    const conversion = this.conversionsRepository.create({
      order_id: data.orderId,
      link_id: data.linkId,
      affiliate_id: data.affiliateId,
      merchant_id: data.merchantId,
      amount: data.amount,
      currency: data.currency,
      customer_email: data.customerEmail,
      metadata: data.metadata || {},
      status: ConversionStatus.PENDING,
    });

    const savedConversion = await this.conversionsRepository.save(conversion);

    // Update link conversion count
    if (data.linkId) {
      await this.linksRepository.update(data.linkId, {
        total_conversions: () => 'total_conversions + 1',
      });
    }

    return savedConversion;
  }

  async findById(id: number): Promise<Conversion> {
    const conversion = await this.conversionsRepository.findOne({
      where: { id },
      relations: ['link', 'affiliate', 'merchant'],
    });

    if (!conversion) {
      throw new NotFoundException('Conversion not found');
    }

    return conversion;
  }

  async findByOrderId(orderId: string, merchantId: number): Promise<Conversion> {
    const conversion = await this.conversionsRepository.findOne({
      where: {
        order_id: orderId,
        merchant_id: merchantId,
      },
    });

    if (!conversion) {
      throw new NotFoundException('Conversion not found');
    }

    return conversion;
  }

  async update(id: number, data: Partial<Conversion>): Promise<Conversion> {
    await this.conversionsRepository.update(id, data);
    return this.findById(id);
  }

  async approve(id: number): Promise<Conversion> {
    return this.update(id, { status: ConversionStatus.APPROVED });
  }

  async reject(id: number, reason: string): Promise<Conversion> {
    return this.update(id, {
      status: ConversionStatus.REJECTED,
      rejection_reason: reason,
    });
  }

  async refund(id: number): Promise<Conversion> {
    return this.update(id, { status: ConversionStatus.REFUNDED });
  }

  async findByMerchantId(merchantId: number, limit: number = 10, offset: number = 0) {
    const [conversions, total] = await this.conversionsRepository.findAndCount({
      where: { merchant_id: merchantId },
      take: limit,
      skip: offset,
      relations: ['link', 'affiliate'],
      order: { created_at: 'DESC' },
    });

    return {
      items: conversions,
      total,
      page: Math.floor(offset / limit) + 1,
      pageSize: limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findByAffiliateId(affiliateId: number, limit: number = 10, offset: number = 0) {
    const [conversions, total] = await this.conversionsRepository.findAndCount({
      where: { affiliate_id: affiliateId },
      take: limit,
      skip: offset,
      relations: ['link', 'merchant'],
      order: { created_at: 'DESC' },
    });

    return {
      items: conversions,
      total,
      page: Math.floor(offset / limit) + 1,
      pageSize: limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findByLinkId(linkId: number, limit: number = 10, offset: number = 0) {
    const [conversions, total] = await this.conversionsRepository.findAndCount({
      where: { link_id: linkId },
      take: limit,
      skip: offset,
      order: { created_at: 'DESC' },
    });

    return {
      items: conversions,
      total,
      page: Math.floor(offset / limit) + 1,
      pageSize: limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getConversionStats(merchantId: number) {
    const conversions = await this.conversionsRepository.find({
      where: { merchant_id: merchantId },
    });

    const totalAmount = conversions.reduce((sum, c) => sum + parseFloat(c.amount.toString()), 0);
    const approvedConversions = conversions.filter((c) => c.status === ConversionStatus.APPROVED);
    const approvedAmount = approvedConversions.reduce(
      (sum, c) => sum + parseFloat(c.amount.toString()),
      0,
    );

    return {
      totalConversions: conversions.length,
      approvedConversions: approvedConversions.length,
      pendingConversions: conversions.filter((c) => c.status === ConversionStatus.PENDING).length,
      rejectedConversions: conversions.filter((c) => c.status === ConversionStatus.REJECTED).length,
      totalAmount,
      approvedAmount,
      averageOrderValue: conversions.length > 0 ? totalAmount / conversions.length : 0,
    };
  }
}

