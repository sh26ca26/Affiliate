import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Headers,
  UseGuards,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiHeader } from '@nestjs/swagger';
import { WebhooksService } from './webhooks.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MerchantsService } from '../merchants/merchants.service';

@ApiTags('Webhooks')
@Controller('api/v1/webhooks')
export class WebhooksController {
  constructor(
    private webhooksService: WebhooksService,
    private merchantsService: MerchantsService,
  ) {}

  @Post('conversions')
  @ApiOperation({ summary: 'Receive conversion webhook from merchant' })
  @ApiHeader({
    name: 'X-Merchant-Api-Key',
    description: 'Merchant API Key',
    required: true,
  })
  @ApiHeader({
    name: 'X-Webhook-Signature',
    description: 'HMAC SHA256 signature of the payload',
    required: true,
  })
  async handleConversionWebhook(
    @Headers('x-merchant-api-key') apiKey: string,
    @Headers('x-webhook-signature') signature: string,
    @Body()
    payload: {
      orderId: string;
      linkId?: number;
      affiliateId?: number;
      amount: number;
      currency: string;
      customerEmail?: string;
      metadata?: Record<string, any>;
    },
  ) {
    if (!apiKey || !signature) {
      throw new BadRequestException('Missing required headers');
    }

    // Validate payload format
    if (!this.webhooksService.validateWebhookPayload(payload)) {
      throw new BadRequestException('Invalid payload format');
    }

    // Get merchant by API key
    const merchant = await this.merchantsService.findByApiKey(apiKey);

    // Handle webhook
    const conversion = await this.webhooksService.handleConversionWebhook(
      merchant.id,
      merchant.api_secret,
      payload,
      signature,
    );

    return {
      id: conversion.id,
      orderId: conversion.order_id,
      status: conversion.status,
      createdAt: conversion.created_at,
    };
  }

  @Get('logs')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get webhook delivery logs' })
  async getWebhookLogs(
    @Query('merchantId') merchantId: number,
    @Query('limit') limit = 10,
    @Query('offset') offset = 0,
  ) {
    return this.webhooksService.getWebhookLogs(merchantId, limit, offset);
  }

  @Post('test')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Send test webhook' })
  async sendTestWebhook(
    @Body()
    body: {
      merchantId: number;
      webhookUrl: string;
    },
  ) {
    const merchant = await this.merchantsService.findById(body.merchantId);

    const testPayload = {
      id: 0,
      orderId: 'test_' + Date.now(),
      status: 'pending',
      amount: 99.99,
      currency: 'USD',
    };

    await this.webhooksService.sendConversionStatusWebhook(
      body.webhookUrl,
      merchant.api_secret,
      testPayload,
    );

    return { message: 'Test webhook sent successfully' };
  }
}

