import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { MerchantsService } from './merchants.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PayoutSchedule } from '@/entities';

@ApiTags('Merchants')
@Controller('api/v1/merchants')
export class MerchantsController {
  constructor(private merchantsService: MerchantsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new merchant' })
  async create(
    @Request() req,
    @Body()
    body: {
      name: string;
      slug: string;
      description?: string;
      logoUrl?: string;
      websiteUrl?: string;
      commissionRate: number;
      payoutSchedule: PayoutSchedule;
    },
  ) {
    const merchant = await this.merchantsService.create(req.user.sub, body);
    return {
      id: merchant.id,
      name: merchant.name,
      slug: merchant.slug,
      apiKey: merchant.api_key,
      apiSecret: merchant.api_secret,
      commissionRate: merchant.commission_rate,
      payoutSchedule: merchant.payout_schedule,
      createdAt: merchant.created_at,
    };
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all merchants for current user' })
  async findAll(@Request() req, @Query('limit') limit = 10, @Query('offset') offset = 0) {
    const merchants = await this.merchantsService.findByUserId(req.user.sub);
    return merchants.map((m) => ({
      id: m.id,
      name: m.name,
      slug: m.slug,
      commissionRate: m.commission_rate,
      payoutSchedule: m.payout_schedule,
      isActive: m.is_active,
      createdAt: m.created_at,
    }));
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get merchant by ID' })
  async findById(@Param('id') id: number) {
    const merchant = await this.merchantsService.findById(id);
    return {
      id: merchant.id,
      name: merchant.name,
      slug: merchant.slug,
      description: merchant.description,
      logoUrl: merchant.logo_url,
      websiteUrl: merchant.website_url,
      commissionRate: merchant.commission_rate,
      payoutSchedule: merchant.payout_schedule,
      isActive: merchant.is_active,
      createdAt: merchant.created_at,
      updatedAt: merchant.updated_at,
    };
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update merchant' })
  async update(
    @Request() req,
    @Param('id') id: number,
    @Body()
    body: {
      name?: string;
      description?: string;
      logoUrl?: string;
      websiteUrl?: string;
      commissionRate?: number;
      payoutSchedule?: PayoutSchedule;
    },
  ) {
    const merchant = await this.merchantsService.update(id, req.user.sub, body);
    return {
      id: merchant.id,
      name: merchant.name,
      slug: merchant.slug,
      commissionRate: merchant.commission_rate,
      payoutSchedule: merchant.payout_schedule,
      updatedAt: merchant.updated_at,
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete merchant' })
  async delete(@Request() req, @Param('id') id: number) {
    await this.merchantsService.delete(id, req.user.sub);
    return { message: 'Merchant deleted successfully' };
  }

  @Post(':id/api-key')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Rotate merchant API key' })
  async rotateApiKey(@Request() req, @Param('id') id: number) {
    const result = await this.merchantsService.rotateApiKey(id, req.user.sub);
    return {
      apiKey: result.apiKey,
      apiSecret: result.apiSecret,
      message: 'API key rotated successfully',
    };
  }
}

