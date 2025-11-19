import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { BullModule } from '@nestjs/bullmq';

import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { MerchantsModule } from './modules/merchants/merchants.module';
import { AffiliatesModule } from './modules/affiliates/affiliates.module';
import { LinksModule } from './modules/links/links.module';
import { ClicksModule } from './modules/clicks/clicks.module';
import { ConversionsModule } from './modules/conversions/conversions.module';
import { CommissionsModule } from './modules/commissions/commissions.module';
import { PayoutsModule } from './modules/payouts/payouts.module';
// Removed problematic modules

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306'),
      username: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_NAME || 'affiliate_saas',
      entities: [__dirname + '/entities/**/*.entity.ts'],
      migrations: [__dirname + '/migrations/**/*.ts'],
      synchronize: process.env.NODE_ENV === 'development',
      logging: process.env.NODE_ENV === 'development',
    }),

    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
      },
    }),

    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your_secret_key',
      signOptions: { expiresIn: process.env.JWT_EXPIRY || '15m' },
    }),

    PassportModule.register({ defaultStrategy: 'jwt' }),

    // Feature modules
    AuthModule,
    UsersModule,
    MerchantsModule,
    AffiliatesModule,
    LinksModule,
    ClicksModule,
    ConversionsModule,
    CommissionsModule,
    PayoutsModule,
    // Removed problematic modules
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

