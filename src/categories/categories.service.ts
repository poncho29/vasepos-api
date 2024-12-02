import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Category } from './entities/category.entity';

import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

import { validateErrors } from '../helpers';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    try {
      const newCategory = this.categoryRepository.create({
        ...createCategoryDto,
        name: createCategoryDto.name.toLowerCase().trim(),
      });

      await this.categoryRepository.save(newCategory);

      return {
        ok: true,
        message: 'Categoria creada exitosamente',
        category: newCategory,
      };
    } catch (error) {
      validateErrors(error, 'categoria');
    }
  }

  findAll() {
    return this.categoryRepository.find();
  }

  async findOne(id: number) {
    const category = await this.categoryRepository.findOneBy({ id });

    if (!category) {
      throw new NotFoundException('La categoria no existe');
    }

    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.findOne(id);
    category.name = updateCategoryDto.name;
    return await this.categoryRepository.save(category);
  }

  async remove(id: number) {
    const category = await this.findOne(id);

    return await this.categoryRepository.remove(category);
  }
}
