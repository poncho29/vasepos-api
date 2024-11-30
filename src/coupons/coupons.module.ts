import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { CouponsController } from './coupons.controller';
import { CouponsService } from './coupons.service';

import { Coupon } from './entities/coupon.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Coupon])],
  controllers: [CouponsController],
  providers: [CouponsService],
})
export class CouponsModule {}
