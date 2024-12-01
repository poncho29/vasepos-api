import {
  BadRequestException,
  NotFoundException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { endOfDay, isValid, parseISO, startOfDay } from 'date-fns';
import { Between, FindManyOptions, Repository } from 'typeorm';

import { CreateTransactionDto, GetTransactionDto } from './dto';

import { CouponsService } from 'src/coupons/coupons.service';

import { Product } from 'src/products/entities/product.entity';
import {
  TransactionContents,
  Transaction,
} from './entities/transaction.entity';

import { validateErrors } from 'src/helpers';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(TransactionContents)
    private readonly transactionContentsRepository: Repository<TransactionContents>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    private readonly coupunService: CouponsService,
  ) {}

  async create(createTransactionDto: CreateTransactionDto) {
    try {
      await this.productRepository.manager.transaction(
        async (transactionEntityManager) => {
          const transaction = new Transaction();

          // Calculate transaction total
          const total = Number(
            createTransactionDto.contents
              .reduce((total, item) => total + item.price * item.quantity, 0)
              .toFixed(2),
          );
          transaction.total = total;

          // Apply discount coupon to the transaction
          if (createTransactionDto.coupon) {
            const { coupon } = await this.coupunService.applyCoupon(
              createTransactionDto.coupon,
            );
            const discount = total * (1 - coupon.percentage / 100);
            transaction.discount = discount;
            transaction.coupon = coupon.name;
            transaction.total -= discount;
          }

          for (const content of createTransactionDto.contents) {
            const product = await transactionEntityManager.findOneBy(Product, {
              id: content.productId,
            });

            const errors = [];

            if (!product) {
              errors.push(
                `El product con el ID ${content.productId} no existe`,
              );
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

      return { message: 'Venta almacenada correctamente' };
    } catch (error) {
      validateErrors(error);
    }
  }

  async findAll(query: GetTransactionDto) {
    const { take, skip, transactionDate, status = true } = query;

    const options: FindManyOptions<Transaction> = {
      take: take ?? 2,
      skip: skip ?? 0,
      where: {
        status,
      },
      relations: {
        contents: true,
      },
    };

    if (transactionDate) {
      const date = parseISO(transactionDate);
      if (!isValid(date)) throw new BadRequestException('Fecha no valida');

      const start = startOfDay(date);
      const end = endOfDay(date);

      options.where = {
        ...options.where,
        created_at: Between(start, end),
      };
    }

    const [transactions, count] =
      await this.transactionRepository.findAndCount(options);

    return { transactions, count };
  }

  async findOne(id: number) {
    const transaction = await this.transactionRepository.findOne({
      where: { id },
      relations: {
        contents: true,
      },
    });

    if (!transaction) throw new NotFoundException('La venta no se encontro');

    return transaction;
  }

  async cancelTransaction(id: number) {
    await this.productRepository.manager.transaction(
      async (transactionEntityManager) => {
        const transaction = await transactionEntityManager.findOne(
          Transaction,
          {
            where: { id },
            relations: {
              contents: true,
            },
          },
        );

        if (!transaction)
          throw new NotFoundException(['La venta no se encontro']);

        if (!transaction.status)
          throw new BadRequestException(['La venta ya fue cancelada']);

        for (const content of transaction.contents) {
          const product = await transactionEntityManager.findOneBy(Product, {
            id: content.product.id,
          });

          // Restablecer el inventario
          product.inventory += content.quantity;

          await transactionEntityManager.save(product);
        }

        // Se cancela la venta cambiando el status
        transaction.status = !transaction.status;
        await transactionEntityManager.save(transaction);
      },
    );

    return { message: 'La venta fue cancelada correctamente' };
  }

  // async remove(id: number) {
  //   const transaction = await this.findOne(id);

  //   for (const contents of transaction.contents) {
  //     const product = await this.productRepository.findOneBy({
  //       id: contents.product.id,
  //     });

  //     product.inventory += contents.quantity;
  //     await this.productRepository.save(product);

  //     const transactioContents =
  //       await this.transactionContentsRepository.findOneBy({
  //         id: contents.id,
  //       });

  //     await this.transactionContentsRepository.remove(transactioContents);
  //   }

  //   await this.transactionRepository.remove(transaction);

  //   return { message: 'Venta eliminada correctamente' };
  // }
}
