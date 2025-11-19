import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conversion, Link } from '@/entities';
import { ConversionsController } from './conversions.controller';
import { ConversionsService } from './conversions.service';

@Module({
  imports: [TypeOrmModule.forFeature([Conversion, Link])],
  controllers: [ConversionsController],
  providers: [ConversionsService],
  exports: [ConversionsService],
})
export class ConversionsModule {}

