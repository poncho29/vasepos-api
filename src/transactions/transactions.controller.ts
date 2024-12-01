import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
} from '@nestjs/common';

import { TransactionsService } from './transactions.service';

import { CreateTransactionDto, GetTransactionDto } from './dto';

import { IdValidationPipe } from 'src/common/pipes';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  create(@Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionsService.create(createTransactionDto);
  }

  @Get()
  findAll(@Query() query: GetTransactionDto) {
    return this.transactionsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', IdValidationPipe) id: string) {
    return this.transactionsService.findOne(+id);
  }

  @Delete(':id')
  cancelTransaction(@Param('id', IdValidationPipe) id: string) {
    return this.transactionsService.cancelTransaction(+id);
  }

  // @Delete(':id')
  // remove(@Param('id', IdValidationPipe) id: string) {
  //   return this.transactionsService.remove(+id);
  // }
}
