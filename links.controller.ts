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
  Res,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { LinksService } from './links.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { LinkType } from '@/entities';
import { Response } from 'express';

@ApiTags('Links')
@Controller('api/v1/links')
export class LinksController {
  constructor(private linksService: LinksService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new referral link' })
  async create(
    @Request() req,
    @Body()
    body: {
      merchantId: number;
      affiliateId?: number;
      type: LinkType;
      targetId?: string;
      targetUrl: string;
      title?: string;
      description?: string;
      utmParams?: Record<string, string>;
    },
  ) {
    const link = await this.linksService.create(body);
    return {
      id: link.id,
      slug: link.slug,
      type: link.type,
      targetUrl: link.target_url,
      title: link.title,
      description: link.description,
      totalClicks: link.total_clicks,
      totalConversions: link.total_conversions,
      shortUrl: `${process.env.API_URL}/r/${link.slug}`,
      createdAt: link.created_at,
    };
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Redirect handler - records click and redirects to target URL' })
  async redirect(
    @Param('slug') slug: string,
    @Res() res: Response,
    @Query('utm_source') utmSource?: string,
    @Query('utm_medium') utmMedium?: string,
    @Query('utm_campaign') utmCampaign?: string,
  ) {
    try {
      const result = await this.linksService.recordClick(slug, {
        ipAddress: this.getClientIp(),
        userAgent: this.getUserAgent(),
        utm: {
          source: utmSource,
          medium: utmMedium,
          campaign: utmCampaign,
        },
      });

      // Redirect to target URL
      res.redirect(HttpStatus.MOVED_PERMANENTLY, result.redirectUrl);
    } catch (error) {
      res.status(404).json({ error: 'Link not found' });
    }
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all links for merchant' })
  async findAll(
    @Request() req,
    @Query('merchantId') merchantId: number,
    @Query('limit') limit = 10,
    @Query('offset') offset = 0,
  ) {
    return this.linksService.findByMerchantId(merchantId, limit, offset);
  }

  @Get('merchant/:merchantId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get links by merchant ID' })
  async findByMerchantId(
    @Param('merchantId') merchantId: number,
    @Query('limit') limit = 10,
    @Query('offset') offset = 0,
  ) {
    return this.linksService.findByMerchantId(merchantId, limit, offset);
  }

  @Get('affiliate/:affiliateId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get links by affiliate ID' })
  async findByAffiliateId(
    @Param('affiliateId') affiliateId: number,
    @Query('limit') limit = 10,
    @Query('offset') offset = 0,
  ) {
    return this.linksService.findByAffiliateId(affiliateId, limit, offset);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update link' })
  async update(
    @Request() req,
    @Param('id') id: number,
    @Body()
    body: {
      merchantId: number;
      title?: string;
      description?: string;
      isActive?: boolean;
    },
  ) {
    const link = await this.linksService.update(id, body.merchantId, body);
    return {
      id: link.id,
      slug: link.slug,
      title: link.title,
      description: link.description,
      isActive: link.is_active,
      updatedAt: link.updated_at,
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete link' })
  async delete(
    @Request() req,
    @Param('id') id: number,
    @Body() body: { merchantId: number },
  ) {
    await this.linksService.delete(id, body.merchantId);
    return { message: 'Link deleted successfully' };
  }

  private getClientIp(): string {
    // This would be extracted from request headers in a real implementation
    return '0.0.0.0';
  }

  private getUserAgent(): string {
    // This would be extracted from request headers in a real implementation
    return 'Unknown';
  }
}

