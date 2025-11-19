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
import { AffiliatesService } from './affiliates.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Affiliates')
@Controller('api/v1/affiliates')
export class AffiliatesController {
  constructor(private affiliatesService: AffiliatesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create affiliate profile' })
  async create(
    @Request() req,
    @Body()
    body?: {
      displayName?: string;
      bio?: string;
      websiteUrl?: string;
    },
  ) {
    const affiliate = await this.affiliatesService.create(req.user.sub, body);
    return {
      id: affiliate.id,
      affiliateCode: affiliate.affiliate_code,
      displayName: affiliate.display_name,
      bio: affiliate.bio,
      websiteUrl: affiliate.website_url,
      totalClicks: affiliate.total_clicks,
      totalConversions: affiliate.total_conversions,
      totalEarnings: affiliate.total_earnings,
      createdAt: affiliate.created_at,
    };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current affiliate profile' })
  async getCurrentAffiliate(@Request() req) {
    const affiliate = await this.affiliatesService.findByUserId(req.user.sub);
    return {
      id: affiliate.id,
      affiliateCode: affiliate.affiliate_code,
      displayName: affiliate.display_name,
      bio: affiliate.bio,
      avatarUrl: affiliate.avatar_url,
      websiteUrl: affiliate.website_url,
      totalClicks: affiliate.total_clicks,
      totalConversions: affiliate.total_conversions,
      totalEarnings: affiliate.total_earnings,
      isActive: affiliate.is_active,
      createdAt: affiliate.created_at,
      updatedAt: affiliate.updated_at,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get affiliate by ID' })
  async findById(@Param('id') id: number) {
    const affiliate = await this.affiliatesService.findById(id);
    return {
      id: affiliate.id,
      affiliateCode: affiliate.affiliate_code,
      displayName: affiliate.display_name,
      bio: affiliate.bio,
      avatarUrl: affiliate.avatar_url,
      websiteUrl: affiliate.website_url,
      totalClicks: affiliate.total_clicks,
      totalConversions: affiliate.total_conversions,
      totalEarnings: affiliate.total_earnings,
      isActive: affiliate.is_active,
      createdAt: affiliate.created_at,
    };
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update affiliate profile' })
  async update(
    @Request() req,
    @Param('id') id: number,
    @Body()
    body: {
      displayName?: string;
      bio?: string;
      avatarUrl?: string;
      websiteUrl?: string;
    },
  ) {
    const affiliate = await this.affiliatesService.update(id, body);
    return {
      id: affiliate.id,
      displayName: affiliate.display_name,
      bio: affiliate.bio,
      avatarUrl: affiliate.avatar_url,
      websiteUrl: affiliate.website_url,
      updatedAt: affiliate.updated_at,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get all affiliates' })
  async findAll(@Query('limit') limit = 10, @Query('offset') offset = 0) {
    return this.affiliatesService.findAll(limit, offset);
  }

  @Get('top/earners')
  @ApiOperation({ summary: 'Get top earning affiliates' })
  async getTopAffiliates(@Query('limit') limit = 10) {
    const affiliates = await this.affiliatesService.getTopAffiliates(limit);
    return affiliates.map((a) => ({
      id: a.id,
      displayName: a.display_name,
      affiliateCode: a.affiliate_code,
      totalEarnings: a.total_earnings,
      totalConversions: a.total_conversions,
    }));
  }
}

