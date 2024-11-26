import { IsNumberString, IsOptional } from 'class-validator';

export class GetProductDto {
  @IsOptional()
  @IsNumberString({}, { message: 'El query take debe ser un número' })
  take?: number;

  @IsOptional()
  @IsNumberString({}, { message: 'El query skip debe ser un número' })
  skip?: number;

  @IsOptional()
  @IsNumberString({}, { message: 'El category_id debe ser un número' })
  category_id?: number;
}
