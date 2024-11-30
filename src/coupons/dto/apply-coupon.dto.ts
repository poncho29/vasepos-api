import { IsNotEmpty } from 'class-validator';

export class ApplyCouponDto {
  @IsNotEmpty({ message: 'El nombre del cupón es requerido' })
  name: string;
}
