import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Affiliate } from '@/entities';
import { AffiliatesController } from './affiliates.controller';
import { AffiliatesService } from './affiliates.service';

@Module({
  imports: [TypeOrmModule.forFeature([Affiliate])],
  controllers: [AffiliatesController],
  providers: [AffiliatesService],
  exports: [AffiliatesService],
})
export class AffiliatesModule {}

