import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PayoutsService } from './payouts.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Payouts')
@Controller('api/v1/payouts')
export class PayoutsController {
  constructor(private payoutsService: PayoutsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Request a payout' })
  async requestPayout(
    @Request() req,
    @Body()
    body: {
      amount: number;
      method: string;
      methodDetails: Record<string, any>;
    },
  ) {
    const payout = await this.payoutsService.requestPayout(req.user.sub, body);
    return {
      id: payout.id,
      amount: payout.amount,
      currency: payout.currency,
      method: payout.method,
      status: payout.status,
      requestedAt: payout.requested_at,
    };
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get payout by ID' })
  async findById(@Param('id') id: number) {
    const payout = await this.payoutsService.findById(id);
    return {
      id: payout.id,
      affiliateId: payout.affiliate_id,
      amount: payout.amount,
      currency: payout.currency,
      method: payout.method,
      status: payout.status,
      transactionId: payout.transaction_id,
      failureReason: payout.failure_reason,
      requestedAt: payout.requested_at,
      processedAt: payout.processed_at,
      completedAt: payout.completed_at,
    };
  }

  @Get('affiliate/:affiliateId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get payouts by affiliate ID' })
  async findByAffiliateId(
    @Param('affiliateId') affiliateId: number,
    @Query('limit') limit = 10,
    @Query('offset') offset = 0,
  ) {
    return this.payoutsService.findByAffiliateId(affiliateId, limit, offset);
  }

  @Put(':id/approve')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Approve payout (admin only)' })
  async approvePayout(@Param('id') id: number) {
    const payout = await this.payoutsService.approvePayout(id);
    return {
      id: payout.id,
      status: payout.status,
      updatedAt: new Date(),
    };
  }

  @Put(':id/process')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Process payout (admin only)' })
  async processPayout(@Param('id') id: number) {
    const payout = await this.payoutsService.processPayout(id);
    return {
      id: payout.id,
      status: payout.status,
      processedAt: payout.processed_at,
    };
  }

  @Put(':id/complete')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Complete payout (admin only)' })
  async completePayout(
    @Param('id') id: number,
    @Body() body: { transactionId: string },
  ) {
    const payout = await this.payoutsService.completePayout(id, body.transactionId);
    return {
      id: payout.id,
      status: payout.status,
      transactionId: payout.transaction_id,
      completedAt: payout.completed_at,
    };
  }

  @Put(':id/fail')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mark payout as failed (admin only)' })
  async failPayout(
    @Param('id') id: number,
    @Body() body: { reason: string },
  ) {
    const payout = await this.payoutsService.failPayout(id, body.reason);
    return {
      id: payout.id,
      status: payout.status,
      failureReason: payout.failure_reason,
    };
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get pending payouts (admin only)' })
  async getPendingPayouts(@Query('limit') limit = 10, @Query('offset') offset = 0) {
    return this.payoutsService.getPendingPayouts(limit, offset);
  }

  @Get('affiliate/:affiliateId/stats')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get payout statistics for affiliate' })
  async getStats(@Param('affiliateId') affiliateId: number) {
    return this.payoutsService.getPayoutStats(affiliateId);
  }
}

