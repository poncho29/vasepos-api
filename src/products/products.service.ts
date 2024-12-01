import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { FindManyOptions, Repository } from 'typeorm';

import { Category } from 'src/categories/entities/category.entity';
import { Product } from './entities/product.entity';

import { CreateProductDto, UpdateProductDto, GetProductDto } from './dto';

import { validateErrors } from 'src/helpers';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    try {
      const category = await this.categoryRepository.findOneBy({
        id: createProductDto.categoryId,
      });

      if (!category) {
        const errors = [];
        errors.push('La categoría no existe');
        throw new NotFoundException(errors);
      }

      const newProduct = this.productRepository.save({
        ...createProductDto,
        category,
      });

      return {
        product: newProduct,
        message: 'Producto creado exitosamente',
      };
    } catch (error) {
      validateErrors(error);
    }
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

  async findOne(id: number) {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: {
        category: true,
      },
    });

    if (!product) throw new NotFoundException('El producto no existe');

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    try {
      const product = await this.findOne(id);
      Object.assign(product, updateProductDto);

      if (updateProductDto.categoryId) {
        const category = await this.categoryRepository.findOneBy({
          id: updateProductDto.categoryId,
        });

        if (!category) {
          const errors = [];
          errors.push('La categoría no existe');
          throw new NotFoundException(errors);
        }

        product.category = category;
      }

      const updatedProduct = await this.productRepository.save(product);

      return {
        product: updatedProduct,
        message: 'Producto actualizado correctamente',
      };
    } catch (error) {
      validateErrors(error);
    }
  }

  async remove(id: number) {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
    return { message: 'Producto eliminado correctamente' };
  }
}
