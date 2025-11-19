import {
  Controller,
  Get,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Analytics')
@Controller('api/v1/analytics')
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  @Get('merchant/:merchantId/dashboard')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get merchant dashboard statistics' })
  async getMerchantDashboard(
    @Param('merchantId') merchantId: number,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.analyticsService.getMerchantDashboard(merchantId, start, end);
  }

  @Get('affiliate/:affiliateId/dashboard')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get affiliate dashboard statistics' })
  async getAffiliateDashboard(
    @Param('affiliateId') affiliateId: number,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.analyticsService.getAffiliateDashboard(affiliateId, start, end);
  }

  @Get('merchant/:merchantId/top-links')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get top performing links' })
  async getTopLinks(
    @Param('merchantId') merchantId: number,
    @Query('limit') limit = 10,
  ) {
    return this.analyticsService.getTopLinks(merchantId, limit);
  }

  @Get('merchant/:merchantId/clicks-over-time')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get clicks over time' })
  async getClicksOverTime(
    @Param('merchantId') merchantId: number,
    @Query('days') days = 30,
  ) {
    return this.analyticsService.getClicksOverTime(merchantId, days);
  }

  @Get('merchant/:merchantId/conversions-over-time')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get conversions over time' })
  async getConversionsOverTime(
    @Param('merchantId') merchantId: number,
    @Query('days') days = 30,
  ) {
    return this.analyticsService.getConversionsOverTime(merchantId, days);
  }

  @Get('merchant/:merchantId/revenue-over-time')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get revenue over time' })
  async getRevenueOverTime(
    @Param('merchantId') merchantId: number,
    @Query('days') days = 30,
  ) {
    return this.analyticsService.getRevenueOverTime(merchantId, days);
  }

  @Get('merchant/:merchantId/traffic-sources')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get traffic sources' })
  async getTrafficSources(
    @Param('merchantId') merchantId: number,
    @Query('limit') limit = 10,
  ) {
    return this.analyticsService.getTrafficSources(merchantId, limit);
  }

  @Get('merchant/:merchantId/device-breakdown')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get device breakdown' })
  async getDeviceBreakdown(
    @Param('merchantId') merchantId: number,
  ) {
    return this.analyticsService.getDeviceBreakdown(merchantId);
  }
}

