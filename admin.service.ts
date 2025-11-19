import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole, Merchant, Affiliate, Conversion, ConversionStatus, FraudLog } from '@/entities';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Merchant)
    private merchantsRepository: Repository<Merchant>,
    @InjectRepository(Affiliate)
    private affiliatesRepository: Repository<Affiliate>,
    @InjectRepository(Conversion)
    private conversionsRepository: Repository<Conversion>,
    @InjectRepository(FraudLog)
    private fraudLogsRepository: Repository<FraudLog>,
  ) {}

  /**
   * Verify user is admin
   */
  async verifyAdmin(userId: number): Promise<void> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user || user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Admin access required');
    }
  }

  /**
   * Get system statistics
   */
  async getSystemStats() {
    const totalUsers = await this.usersRepository.count();
    const totalMerchants = await this.merchantsRepository.count();
    const totalAffiliates = await this.affiliatesRepository.count();
    const totalConversions = await this.conversionsRepository.count();
    const approvedConversions = await this.conversionsRepository.count({
      where: { status: ConversionStatus.APPROVED },
    });

    return {
      totalUsers,
      totalMerchants,
      totalAffiliates,
      totalConversions,
      approvedConversions,
      pendingConversions: totalConversions - approvedConversions,
    };
  }

  /**
   * Get all users with pagination
   */
  async getAllUsers(limit: number = 10, offset: number = 0) {
    const [users, total] = await this.usersRepository.findAndCount({
      take: limit,
      skip: offset,
      order: { created_at: 'DESC' },
    });

    return {
      items: users.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        verified: u.verified,
        isActive: u.is_active,
        createdAt: u.created_at,
      })),
      total,
      page: Math.floor(offset / limit) + 1,
      pageSize: limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Get all merchants with pagination
   */
  async getAllMerchants(limit: number = 10, offset: number = 0) {
    const [merchants, total] = await this.merchantsRepository.findAndCount({
      take: limit,
      skip: offset,
      relations: ['user'],
      order: { created_at: 'DESC' },
    });

    return {
      items: merchants.map((m) => ({
        id: m.id,
        name: m.name,
        slug: m.slug,
        userId: m.user_id,
        commissionRate: m.commission_rate,
        isActive: m.is_active,
        createdAt: m.created_at,
      })),
      total,
      page: Math.floor(offset / limit) + 1,
      pageSize: limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Get all affiliates with pagination
   */
  async getAllAffiliates(limit: number = 10, offset: number = 0) {
    const [affiliates, total] = await this.affiliatesRepository.findAndCount({
      take: limit,
      skip: offset,
      relations: ['user'],
      order: { created_at: 'DESC' },
    });

    return {
      items: affiliates.map((a) => ({
        id: a.id,
        affiliateCode: a.affiliate_code,
        displayName: a.display_name,
        userId: a.user_id,
        totalEarnings: a.total_earnings,
        totalConversions: a.total_conversions,
        isActive: a.is_active,
        createdAt: a.created_at,
      })),
      total,
      page: Math.floor(offset / limit) + 1,
      pageSize: limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Suspend user
   */
  async suspendUser(userId: number): Promise<void> {
    await this.usersRepository.update(userId, { is_active: 0 });
  }

  /**
   * Activate user
   */
  async activateUser(userId: number): Promise<void> {
    await this.usersRepository.update(userId, { is_active: 1 });
  }

  /**
   * Suspend merchant
   */
  async suspendMerchant(merchantId: number): Promise<void> {
    await this.merchantsRepository.update(merchantId, { is_active: 0 });
  }

  /**
   * Activate merchant
   */
  async activateMerchant(merchantId: number): Promise<void> {
    await this.merchantsRepository.update(merchantId, { is_active: 1 });
  }

  /**
   * Suspend affiliate
   */
  async suspendAffiliate(affiliateId: number): Promise<void> {
    await this.affiliatesRepository.update(affiliateId, { is_active: 0 });
  }

  /**
   * Activate affiliate
   */
  async activateAffiliate(affiliateId: number): Promise<void> {
    await this.affiliatesRepository.update(affiliateId, { is_active: 1 });
  }

  /**
   * Get fraud logs
   */
  async getFraudLogs(limit: number = 10, offset: number = 0) {
    const [logs, total] = await this.fraudLogsRepository.findAndCount({
      take: limit,
      skip: offset,
      order: { created_at: 'DESC' },
    });

    return {
      items: logs,
      total,
      page: Math.floor(offset / limit) + 1,
      pageSize: limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Mark fraud log as resolved
   */
  async resolveFraudLog(logId: number): Promise<void> {
    await this.fraudLogsRepository.update(logId, {
      status: 'resolved',
    });
  }

  /**
   * Get pending conversions for review
   */
  async getPendingConversions(limit: number = 10, offset: number = 0) {
    const [conversions, total] = await this.conversionsRepository.findAndCount({
      where: { status: ConversionStatus.PENDING },
      take: limit,
      skip: offset,
      relations: ['link', 'affiliate', 'merchant'],
      order: { created_at: 'ASC' },
    });

    return {
      items: conversions,
      total,
      page: Math.floor(offset / limit) + 1,
      pageSize: limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}

