import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { FindManyOptions, Repository } from 'typeorm';

import { Product } from './entities/product.entity';
import { Category } from 'src/categories/entities/category.entity';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { GetProductDto } from './dto/get-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const category = await this.categoryRepository.findOneBy({
      id: createProductDto.categoryId,
    });

    if (!category) {
      const errors = [];
      errors.push('La categoría no existe');
      throw new NotFoundException(errors);
    }

    return this.productRepository.save({
      ...createProductDto,
      category,
    });
  }

  async findAll(query: GetProductDto) {
    const findOptions: FindManyOptions<Product> = {
      order: {
        id: 'ASC',
      },
      take: query?.take ?? 3,
      skip: query?.skip ?? 0,
      relations: {
        category: true,
      },
    };

    if (query.category_id) {
      findOptions.where = {
        category: {
          id: query.category_id,
        },
      };
    }

    const [products, total] =
      await this.productRepository.findAndCount(findOptions);

    return { products, total };
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
