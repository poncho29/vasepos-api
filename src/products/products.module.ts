import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

import { Category } from 'src/categories/entities/category.entity';
import { Product } from './entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Category])],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
