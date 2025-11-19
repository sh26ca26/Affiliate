import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Commission, CommissionStatus, Conversion } from '@/entities';

@Injectable()
export class CommissionsService {
  constructor(
    @InjectRepository(Commission)
    private commissionsRepository: Repository<Commission>,
    @InjectRepository(Conversion)
    private conversionsRepository: Repository<Conversion>,
  ) {}

  async create(data: {
    conversionId: number;
    affiliateId: number;
    merchantId: number;
    amount: number;
    rate: number;
  }): Promise<Commission> {
    const commission = this.commissionsRepository.create({
      conversion_id: data.conversionId,
      affiliate_id: data.affiliateId,
      merchant_id: data.merchantId,
      amount: data.amount,
      rate: data.rate,
      status: CommissionStatus.UNPAID,
    });

    return this.commissionsRepository.save(commission);
  }

  async findById(id: number): Promise<Commission> {
    const commission = await this.commissionsRepository.findOne({
      where: { id },
      relations: ['conversion', 'affiliate', 'merchant'],
    });

    if (!commission) {
      throw new NotFoundException('Commission not found');
    }

    return commission;
  }

  async findByConversionId(conversionId: number): Promise<Commission | null> {
    return this.commissionsRepository.findOne({
      where: { conversion_id: conversionId },
    });
  }

  async update(id: number, data: Partial<Commission>): Promise<Commission> {
    await this.commissionsRepository.update(id, data);
    return this.findById(id);
  }

  async markAsPaid(id: number, payoutId: number): Promise<Commission> {
    return this.update(id, {
      status: CommissionStatus.PAID,
      payout_id: payoutId,
      paid_at: new Date(),
    });
  }

  async findByAffiliateId(affiliateId: number, limit: number = 10, offset: number = 0) {
    const [commissions, total] = await this.commissionsRepository.findAndCount({
      where: { affiliate_id: affiliateId },
      take: limit,
      skip: offset,
      relations: ['conversion', 'merchant'],
      order: { created_at: 'DESC' },
    });

    return {
      items: commissions,
      total,
      page: Math.floor(offset / limit) + 1,
      pageSize: limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findByMerchantId(merchantId: number, limit: number = 10, offset: number = 0) {
    const [commissions, total] = await this.commissionsRepository.findAndCount({
      where: { merchant_id: merchantId },
      take: limit,
      skip: offset,
      relations: ['affiliate', 'conversion'],
      order: { created_at: 'DESC' },
    });

    return {
      items: commissions,
      total,
      page: Math.floor(offset / limit) + 1,
      pageSize: limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findUnpaidByAffiliateId(affiliateId: number) {
    return this.commissionsRepository.find({
      where: {
        affiliate_id: affiliateId,
        status: CommissionStatus.UNPAID,
      },
      relations: ['conversion'],
      order: { created_at: 'DESC' },
    });
  }

  async getAffiliateStats(affiliateId: number) {
    const commissions = await this.commissionsRepository.find({
      where: { affiliate_id: affiliateId },
    });

    const totalEarnings = commissions.reduce(
      (sum, c) => sum + parseFloat(c.amount.toString()),
      0,
    );
    const paidEarnings = commissions
      .filter((c) => c.status === CommissionStatus.PAID)
      .reduce((sum, c) => sum + parseFloat(c.amount.toString()), 0);
    const unpaidEarnings = commissions
      .filter((c) => c.status === CommissionStatus.UNPAID)
      .reduce((sum, c) => sum + parseFloat(c.amount.toString()), 0);

    return {
      totalCommissions: commissions.length,
      totalEarnings,
      paidEarnings,
      unpaidEarnings,
      paidCount: commissions.filter((c) => c.status === CommissionStatus.PAID).length,
      unpaidCount: commissions.filter((c) => c.status === CommissionStatus.UNPAID).length,
    };
  }

  async calculateCommissionForConversion(conversionId: number, rate: number): Promise<number> {
    const conversion = await this.conversionsRepository.findOne({
      where: { id: conversionId },
    });

    if (!conversion) {
      throw new NotFoundException('Conversion not found');
    }

    return parseFloat(conversion.amount.toString()) * (rate / 100);
  }
}

