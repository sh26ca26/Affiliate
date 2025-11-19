import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Link, Click } from '@/entities';
import { LinksController } from './links.controller';
import { LinksService } from './links.service';

@Module({
  imports: [TypeOrmModule.forFeature([Link, Click])],
  controllers: [LinksController],
  providers: [LinksService],
  exports: [LinksService],
})
export class LinksModule {}

