import { IsInt, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty({ message: 'El nombre es requerido' })
  @IsString({ message: 'El nombreo debe ser un string' })
  name: string;

  @IsNotEmpty({ message: 'El precio es requerido' })
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'El precio debe ser un número' },
  )
  price: number;

  @IsNotEmpty({ message: 'El inventario es requerido' })
  @IsInt({ message: 'El inventario debe ser un número entero' })
  inventory: number;

  @IsNotEmpty({ message: 'La categoría es requerida' })
  @IsInt({ message: 'El id de la categoría debe ser un número entero' })
  categoryId: number;
}
