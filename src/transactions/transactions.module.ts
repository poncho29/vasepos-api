import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { CouponsModule } from '../coupons/coupons.module';

import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';

import { Product } from '../products/entities/product.entity';
import {
  TransactionContents,
  Transaction,
} from './entities/transaction.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction, TransactionContents, Product]),
    CouponsModule,
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService],
})
export class TransactionsModule {}
