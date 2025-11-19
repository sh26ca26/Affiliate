import {
  Controller,
  Get,
  Param,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CommissionsService } from './commissions.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Commissions')
@Controller('api/v1/commissions')
export class CommissionsController {
  constructor(private commissionsService: CommissionsService) {}

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get commission by ID' })
  async findById(@Param('id') id: number) {
    const commission = await this.commissionsService.findById(id);
    return {
      id: commission.id,
      conversionId: commission.conversion_id,
      affiliateId: commission.affiliate_id,
      merchantId: commission.merchant_id,
      amount: commission.amount,
      rate: commission.rate,
      status: commission.status,
      payoutId: commission.payout_id,
      createdAt: commission.created_at,
      paidAt: commission.paid_at,
    };
  }

  @Get('affiliate/:affiliateId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get commissions by affiliate ID' })
  async findByAffiliateId(
    @Param('affiliateId') affiliateId: number,
    @Query('limit') limit = 10,
    @Query('offset') offset = 0,
  ) {
    return this.commissionsService.findByAffiliateId(affiliateId, limit, offset);
  }

  @Get('merchant/:merchantId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get commissions by merchant ID' })
  async findByMerchantId(
    @Param('merchantId') merchantId: number,
    @Query('limit') limit = 10,
    @Query('offset') offset = 0,
  ) {
    return this.commissionsService.findByMerchantId(merchantId, limit, offset);
  }

  @Get('affiliate/:affiliateId/stats')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get commission statistics for affiliate' })
  async getStats(@Param('affiliateId') affiliateId: number) {
    return this.commissionsService.getAffiliateStats(affiliateId);
  }
}

