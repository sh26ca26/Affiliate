import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as helmet from 'helmet';
import * as rateLimit from 'express-rate-limit';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  // Security middleware
  app.use(helmet());
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
      message: 'Too many requests from this IP, please try again later.',
    }),
  );

  // CORS configuration
  app.enableCors({
    origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3001', 'http://localhost:3000'],
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Affiliate SaaS API')
    .setDescription('A production-grade Affiliate/Referral SaaS Platform API')
    .setVersion('1.0.0')
    .addBearerAuth()
    .addApiKey({ type: 'apiKey', name: 'X-Merchant-Api-Key', in: 'header' }, 'merchant-api-key')
    .addTag('Auth', 'Authentication endpoints')
    .addTag('Users', 'User management endpoints')
    .addTag('Merchants', 'Merchant management endpoints')
    .addTag('Affiliates', 'Affiliate management endpoints')
    .addTag('Links', 'Referral link endpoints')
    .addTag('Clicks', 'Click tracking endpoints')
    .addTag('Conversions', 'Conversion tracking endpoints')
    .addTag('Commissions', 'Commission management endpoints')
    .addTag('Payouts', 'Payout management endpoints')
    .addTag('Webhooks', 'Webhook endpoints')
    .addTag('Admin', 'Admin management endpoints')
    .addTag('Analytics', 'Analytics endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/swagger', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'list',
      filter: true,
      showRequestHeaders: true,
      supportedSubmitMethods: ['get', 'post', 'put', 'delete', 'patch'],
    },
  });

  // Health check endpoint
  app.get('/health', () => ({ status: 'ok' }));

  const port = process.env.API_PORT || 3000;
  await app.listen(port);

  console.log(`🚀 Affiliate SaaS API is running on http://localhost:${port}`);
  console.log(`📚 Swagger documentation: http://localhost:${port}/api/swagger`);
}

bootstrap().catch((err) => {
  console.error('Failed to start application:', err);
  process.exit(1);
});

