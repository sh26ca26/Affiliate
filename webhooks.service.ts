import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Conversion, ConversionStatus } from '@/entities';
import * as crypto from 'crypto';

@Injectable()
export class WebhooksService {
  constructor(
    @InjectRepository(Conversion)
    private conversionsRepository: Repository<Conversion>,
  ) {}

  /**
   * Handle conversion webhook from merchant
   * Merchant sends conversion data with HMAC signature
   */
  async handleConversionWebhook(
    merchantId: number,
    apiSecret: string,
    payload: {
      orderId: string;
      linkId?: number;
      affiliateId?: number;
      amount: number;
      currency: string;
      customerEmail?: string;
      metadata?: Record<string, any>;
    },
    signature: string,
  ): Promise<Conversion> {
    // Verify signature
    const payloadString = JSON.stringify(payload);
    const expectedSignature = crypto
      .createHmac('sha256', apiSecret)
      .update(payloadString)
      .digest('hex');

    if (expectedSignature !== signature) {
      throw new BadRequestException('Invalid webhook signature');
    }

    // Check for duplicate order
    const existingConversion = await this.conversionsRepository.findOne({
      where: {
        order_id: payload.orderId,
        merchant_id: merchantId,
      },
    });

    if (existingConversion) {
      // Return existing conversion for idempotency
      return existingConversion;
    }

    // Create conversion
    const conversion = this.conversionsRepository.create({
      order_id: payload.orderId,
      link_id: payload.linkId,
      affiliate_id: payload.affiliateId,
      merchant_id: merchantId,
      amount: payload.amount,
      currency: payload.currency,
      customer_email: payload.customerEmail,
      metadata: payload.metadata || {},
      status: ConversionStatus.PENDING,
    });

    return this.conversionsRepository.save(conversion);
  }

  /**
   * Send webhook to merchant about conversion status change
   */
  async sendConversionStatusWebhook(
    merchantWebhookUrl: string,
    apiSecret: string,
    conversionData: {
      id: number;
      orderId: string;
      status: ConversionStatus;
      amount: number;
      currency: string;
    },
  ): Promise<void> {
    const payload = JSON.stringify(conversionData);
    const signature = crypto
      .createHmac('sha256', apiSecret)
      .update(payload)
      .digest('hex');

    try {
      await fetch(merchantWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Webhook-Signature': signature,
          'X-Webhook-Timestamp': new Date().toISOString(),
        },
        body: payload,
      });
    } catch (error) {
      console.error(`Failed to send webhook to ${merchantWebhookUrl}:`, error);
      // In production, implement retry logic with exponential backoff
    }
  }

  /**
   * Validate webhook payload format
   */
  validateWebhookPayload(payload: any): boolean {
    if (!payload.orderId || typeof payload.orderId !== 'string') {
      return false;
    }

    if (!payload.amount || typeof payload.amount !== 'number' || payload.amount <= 0) {
      return false;
    }

    if (!payload.currency || typeof payload.currency !== 'string') {
      return false;
    }

    return true;
  }

  /**
   * Get webhook delivery logs (for debugging)
   */
  async getWebhookLogs(merchantId: number, limit: number = 10, offset: number = 0) {
    // This would be implemented with a separate WebhookLog entity
    // For now, returning a placeholder
    return {
      items: [],
      total: 0,
      page: 1,
      pageSize: limit,
      totalPages: 0,
    };
  }
}

