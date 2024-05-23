import { Module } from '@nestjs/common';
import { RedsocialService } from './redsocial.service';
import { RedsocialEntity } from './redsocial.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedsocialController } from './redsocial.controller';

@Module({
  imports: [TypeOrmModule.forFeature([RedsocialEntity])],
  providers: [RedsocialService],
  controllers: [RedsocialController]
})
export class RedsocialModule {}
