import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payout, PayoutStatus, Commission, CommissionStatus } from '@/entities';

@Injectable()
export class PayoutsService {
  constructor(
    @InjectRepository(Payout)
    private payoutsRepository: Repository<Payout>,
    @InjectRepository(Commission)
    private commissionsRepository: Repository<Commission>,
  ) {}

  async requestPayout(affiliateId: number, data: {
    amount: number;
    method: string;
    methodDetails: Record<string, any>;
  }): Promise<Payout> {
    // Validate amount
    if (data.amount <= 0) {
      throw new BadRequestException('Payout amount must be greater than 0');
    }

    // Check if affiliate has enough unpaid commissions
    const unpaidCommissions = await this.commissionsRepository.find({
      where: {
        affiliate_id: affiliateId,
        status: CommissionStatus.UNPAID,
      },
    });

    const totalUnpaid = unpaidCommissions.reduce(
      (sum, c) => sum + parseFloat(c.amount.toString()),
      0,
    );

    if (data.amount > totalUnpaid) {
      throw new BadRequestException('Requested amount exceeds available unpaid commissions');
    }

    const payout = this.payoutsRepository.create({
      affiliate_id: affiliateId,
      amount: data.amount,
      currency: 'USD',
      method: data.method,
      method_details: data.methodDetails,
      status: PayoutStatus.REQUESTED,
    });

    return this.payoutsRepository.save(payout);
  }

  async findById(id: number): Promise<Payout> {
    const payout = await this.payoutsRepository.findOne({
      where: { id },
      relations: ['affiliate'],
    });

    if (!payout) {
      throw new NotFoundException('Payout not found');
    }

    return payout;
  }

  async findByAffiliateId(affiliateId: number, limit: number = 10, offset: number = 0) {
    const [payouts, total] = await this.payoutsRepository.findAndCount({
      where: { affiliate_id: affiliateId },
      take: limit,
      skip: offset,
      order: { requested_at: 'DESC' },
    });

    return {
      items: payouts,
      total,
      page: Math.floor(offset / limit) + 1,
      pageSize: limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async approvePayout(id: number): Promise<Payout> {
    const payout = await this.findById(id);

    if (payout.status !== PayoutStatus.REQUESTED) {
      throw new BadRequestException('Only requested payouts can be approved');
    }

    await this.payoutsRepository.update(id, {
      status: PayoutStatus.APPROVED,
    });

    return this.findById(id);
  }

  async processPayout(id: number): Promise<Payout> {
    const payout = await this.findById(id);

    if (payout.status !== PayoutStatus.APPROVED) {
      throw new BadRequestException('Only approved payouts can be processed');
    }

    await this.payoutsRepository.update(id, {
      status: PayoutStatus.PROCESSING,
      processed_at: new Date(),
    });

    return this.findById(id);
  }

  async completePayout(id: number, transactionId: string): Promise<Payout> {
    const payout = await this.findById(id);

    if (payout.status !== PayoutStatus.PROCESSING) {
      throw new BadRequestException('Only processing payouts can be completed');
    }

    // Mark associated commissions as paid
    const unpaidCommissions = await this.commissionsRepository.find({
      where: {
        affiliate_id: payout.affiliate_id,
        status: CommissionStatus.UNPAID,
      },
    });

    let remainingAmount = parseFloat(payout.amount.toString());

    for (const commission of unpaidCommissions) {
      if (remainingAmount <= 0) break;

      const commissionAmount = parseFloat(commission.amount.toString());
      if (commissionAmount <= remainingAmount) {
        await this.commissionsRepository.update(commission.id, {
          status: CommissionStatus.PAID,
          payout_id: id,
          paid_at: new Date(),
        });
        remainingAmount -= commissionAmount;
      }
    }

    await this.payoutsRepository.update(id, {
      status: PayoutStatus.COMPLETED,
      transaction_id: transactionId,
      completed_at: new Date(),
    });

    return this.findById(id);
  }

  async failPayout(id: number, reason: string): Promise<Payout> {
    const payout = await this.findById(id);

    await this.payoutsRepository.update(id, {
      status: PayoutStatus.FAILED,
      failure_reason: reason,
    });

    return this.findById(id);
  }

  async getPendingPayouts(limit: number = 10, offset: number = 0) {
    const [payouts, total] = await this.payoutsRepository.findAndCount({
      where: [
        { status: PayoutStatus.REQUESTED },
        { status: PayoutStatus.APPROVED },
        { status: PayoutStatus.PROCESSING },
      ],
      take: limit,
      skip: offset,
      relations: ['affiliate'],
      order: { requested_at: 'ASC' },
    });

    return {
      items: payouts,
      total,
      page: Math.floor(offset / limit) + 1,
      pageSize: limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getPayoutStats(affiliateId: number) {
    const payouts = await this.payoutsRepository.find({
      where: { affiliate_id: affiliateId },
    });

    const totalRequested = payouts.reduce(
      (sum, p) => sum + parseFloat(p.amount.toString()),
      0,
    );
    const totalCompleted = payouts
      .filter((p) => p.status === PayoutStatus.COMPLETED)
      .reduce((sum, p) => sum + parseFloat(p.amount.toString()), 0);
    const totalPending = payouts
      .filter((p) => [PayoutStatus.REQUESTED, PayoutStatus.APPROVED, PayoutStatus.PROCESSING].includes(p.status))
      .reduce((sum, p) => sum + parseFloat(p.amount.toString()), 0);

    return {
      totalPayouts: payouts.length,
      totalRequested,
      totalCompleted,
      totalPending,
      completedCount: payouts.filter((p) => p.status === PayoutStatus.COMPLETED).length,
      failedCount: payouts.filter((p) => p.status === PayoutStatus.FAILED).length,
    };
  }
}

