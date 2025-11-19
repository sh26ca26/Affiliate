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
import { ConversionsService } from './conversions.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Conversions')
@Controller('api/v1/conversions')
export class ConversionsController {
  constructor(private conversionsService: ConversionsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new conversion' })
  async create(
    @Request() req,
    @Body()
    body: {
      orderId: string;
      linkId?: number;
      affiliateId?: number;
      merchantId: number;
      amount: number;
      currency: string;
      customerEmail?: string;
      metadata?: Record<string, any>;
    },
  ) {
    const conversion = await this.conversionsService.create(body);
    return {
      id: conversion.id,
      orderId: conversion.order_id,
      amount: conversion.amount,
      currency: conversion.currency,
      status: conversion.status,
      createdAt: conversion.created_at,
    };
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get conversion by ID' })
  async findById(@Param('id') id: number) {
    const conversion = await this.conversionsService.findById(id);
    return {
      id: conversion.id,
      orderId: conversion.order_id,
      linkId: conversion.link_id,
      affiliateId: conversion.affiliate_id,
      merchantId: conversion.merchant_id,
      amount: conversion.amount,
      currency: conversion.currency,
      status: conversion.status,
      customerEmail: conversion.customer_email,
      createdAt: conversion.created_at,
      updatedAt: conversion.updated_at,
    };
  }

  @Get('merchant/:merchantId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get conversions by merchant ID' })
  async findByMerchantId(
    @Param('merchantId') merchantId: number,
    @Query('limit') limit = 10,
    @Query('offset') offset = 0,
  ) {
    return this.conversionsService.findByMerchantId(merchantId, limit, offset);
  }

  @Get('affiliate/:affiliateId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get conversions by affiliate ID' })
  async findByAffiliateId(
    @Param('affiliateId') affiliateId: number,
    @Query('limit') limit = 10,
    @Query('offset') offset = 0,
  ) {
    return this.conversionsService.findByAffiliateId(affiliateId, limit, offset);
  }

  @Put(':id/approve')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Approve conversion' })
  async approve(@Param('id') id: number) {
    const conversion = await this.conversionsService.approve(id);
    return {
      id: conversion.id,
      status: conversion.status,
      updatedAt: conversion.updated_at,
    };
  }

  @Put(':id/reject')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reject conversion' })
  async reject(
    @Param('id') id: number,
    @Body() body: { reason: string },
  ) {
    const conversion = await this.conversionsService.reject(id, body.reason);
    return {
      id: conversion.id,
      status: conversion.status,
      rejectionReason: conversion.rejection_reason,
      updatedAt: conversion.updated_at,
    };
  }

  @Put(':id/refund')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Refund conversion' })
  async refund(@Param('id') id: number) {
    const conversion = await this.conversionsService.refund(id);
    return {
      id: conversion.id,
      status: conversion.status,
      updatedAt: conversion.updated_at,
    };
  }

  @Get('merchant/:merchantId/stats')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get conversion statistics for merchant' })
  async getStats(@Param('merchantId') merchantId: number) {
    return this.conversionsService.getConversionStats(merchantId);
  }
}

