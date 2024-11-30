import { IsDateString, IsInt, IsNotEmpty, Max, Min } from 'class-validator';

export class CreateCouponDto {
  @IsNotEmpty({ message: 'El nombre del cupón es requerido' })
  name: string;

  @IsNotEmpty({ message: 'El descuento es requerido' })
  @IsInt({ message: 'El descuento debe ser entre 1 y 100' })
  @Max(100, { message: 'El descuento máximo es de 100' })
  @Min(1, { message: 'El descuento mínimo es de 1' })
  percentage: number;

  @IsNotEmpty({ message: 'La fecha de expiración es requerida' })
  @IsDateString({}, { message: 'La fecha de expiración no es válida' })
  expirationDate: Date;
}
