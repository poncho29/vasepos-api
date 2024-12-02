import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';

import { DataSource, Repository } from 'typeorm';

import { Category } from '../categories/entities/category.entity';
import { Product } from '../products/entities/product.entity';

import { categories } from './data/categories';
import { products } from './data/products';

@Injectable()
export class SeederService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private dataSource: DataSource,
  ) {}

  async onModuleInit() {
    const connection = this.dataSource;
    await connection.dropDatabase();
    await connection.synchronize();
  }

  async seed() {
    await this.categoryRepository.save(categories);

    for await (const product of products) {
      const category = await this.categoryRepository.findOneBy({
        id: product.categoryId,
      });

      const newProduct = new Product();

      newProduct.name = product.name;
      newProduct.price = product.price;
      newProduct.inventory = product.inventory;
      newProduct.image = product.image;
      newProduct.category = category;

      await this.productRepository.save(newProduct);
    }
  }
}
