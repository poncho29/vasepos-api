import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { endOfDay, isAfter } from 'date-fns';
import { Repository } from 'typeorm';

import { Coupon } from './entities/coupon.entity';

import { CreateCouponDto, UpdateCouponDto } from './dto';

import { validateErrors } from 'src/helpers';

@Injectable()
export class CouponsService {
  constructor(
    @InjectRepository(Coupon)
    private readonly couponRepository: Repository<Coupon>,
  ) {}

  async create(createCouponDto: CreateCouponDto) {
    try {
      const coupon = await this.couponRepository.save(createCouponDto);

      return {
        coupon,
        message: 'Cupón creado correctamente',
      };
    } catch (error) {
      validateErrors(error, `Ya existe un cupón con ese nombre`);
    }
  }

  findAll() {
    return this.couponRepository.find();
  }

  async findOne(id: number) {
    const coupon = await this.couponRepository.findOneBy({ id });

    if (!coupon) throw new NotFoundException('El cupón no existe');

    return coupon;
  }

  async update(id: number, updateCouponDto: UpdateCouponDto) {
    try {
      const coupon = await this.findOne(id);

      Object.assign(coupon, updateCouponDto);
      const updatedCupon = await this.couponRepository.save(coupon);

      return {
        coupon: updatedCupon,
        message: 'Cupón actualizado correctamente',
      };
    } catch (error) {
      validateErrors(error, `Ya existe un cupón con ese nombre`);
    }
  }

  async remove(id: number) {
    const coupon = await this.findOne(id);

    if (!coupon) throw new NotFoundException('El cupón no existe');

    await this.couponRepository.remove(coupon);

    return { message: 'Cupón eliminado correctamente' };
  }

  async applyCoupon(name: string) {
    const coupon = await this.couponRepository.findOneBy({ name });

    if (!coupon) throw new NotFoundException('El cupón no existe');

    const currentDate = new Date();
    const expirationDate = endOfDay(coupon.expirationDate);

    if (isAfter(currentDate, expirationDate))
      throw new NotFoundException('El cupón ha expirado');

    return {
      message: 'Cupón válido',
      coupon,
    };
  }
}
