import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateCategoryDto {
  @IsString({ message: 'El nombre de la categoria debe ser un string' })
  @IsNotEmpty({ message: 'El nombre de la categoria es requerido' })
  @MaxLength(50, {
    message: 'El nombre de la categoria debe tener menos de 50 caracteres',
  })
  name: string;
}
