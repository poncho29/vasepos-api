import { IsBooleanString, IsNumberString, IsOptional } from 'class-validator';

export class GetTransactionDto {
  @IsOptional()
  @IsNumberString({}, { message: 'El query take debe ser un número' })
  take?: number;

  @IsOptional()
  @IsNumberString({}, { message: 'El query skip debe ser un número' })
  skip?: number;

  @IsOptional()
  transactionDate?: string;

  @IsOptional()
  @IsBooleanString({ message: 'El status debe ser un booleano' })
  status?: boolean;
}
