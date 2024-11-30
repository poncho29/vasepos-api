import {
  HttpStatus,
  Controller,
  HttpCode,
  Delete,
  Param,
  Patch,
  Post,
  Body,
  Get,
} from '@nestjs/common';

import { CouponsService } from './coupons.service';

import { ApplyCouponDto, CreateCouponDto, UpdateCouponDto } from './dto';

import { IdValidationPipe } from 'src/common/pipes';

@Controller('coupons')
export class CouponsController {
  constructor(private readonly couponsService: CouponsService) {}

  @Post()
  create(@Body() createCouponDto: CreateCouponDto) {
    return this.couponsService.create(createCouponDto);
  }

  @Get()
  findAll() {
    return this.couponsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', IdValidationPipe) id: string) {
    return this.couponsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id', IdValidationPipe) id: string,
    @Body() updateCouponDto: UpdateCouponDto,
  ) {
    return this.couponsService.update(+id, updateCouponDto);
  }

  @Delete(':id')
  remove(@Param('id', IdValidationPipe) id: string) {
    return this.couponsService.remove(+id);
  }

  @Post('apply-coupon')
  @HttpCode(HttpStatus.OK)
  applyCoupon(@Body() applyCouponDto: ApplyCouponDto) {
    return this.couponsService.applyCoupon(applyCouponDto.name);
  }
}
