import {
  BadRequestException,
  NotFoundException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

import { Product } from 'src/products/entities/product.entity';
import {
  TransactionContents,
  Transaction,
} from './entities/transaction.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(TransactionContents)
    private readonly transactionContentsRepository: Repository<TransactionContents>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createTransactionDto: CreateTransactionDto) {
    await this.productRepository.manager.transaction(
      async (transactionEntityManager) => {
        const transaction = new Transaction();
        transaction.total = Number(
          createTransactionDto.contents
            .reduce((total, item) => total + item.price * item.quantity, 0)
            .toFixed(2),
        );

        for (const content of createTransactionDto.contents) {
          const product = await transactionEntityManager.findOneBy(Product, {
            id: content.productId,
          });

          const errors = [];

          if (!product) {
            errors.push(`El product con el ID ${content.productId} no existe`);
            throw new NotFoundException(errors);
          }

          if (content.quantity > product.inventory) {
            errors.push(
              `El producto ${product.name} excede la cantidad disponible`,
            );
            throw new BadRequestException(errors);
          }

          product.inventory -= content.quantity;

          const transactionContent = new TransactionContents();
          transactionContent.quantity = content.quantity;
          transactionContent.price = content.price;
          transactionContent.product = product;
          transactionContent.transaction = transaction;

          await transactionEntityManager.save(transaction);
          await transactionEntityManager.save(transactionContent);
        }
      },
    );

    return 'Venta almacenada correctamente';
  }

  findAll() {
    return `This action returns all transactions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} transaction`;
  }

  update(id: number, updateTransactionDto: UpdateTransactionDto) {
    return `This action updates a #${id} transaction`;
  }

  remove(id: number) {
    return `This action removes a #${id} transaction`;
  }
}
