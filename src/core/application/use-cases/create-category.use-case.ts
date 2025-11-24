import { Injectable } from '@nestjs/common';
import { CategoryRepository } from '@core/domain/repositories/category.repository.interface';
import { Category } from '@core/domain/entities/category.entity';
import { CreateCategoryDto } from '../dtos/create-category.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CreateCategoryUseCase {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(dto: CreateCategoryDto): Promise<Category> {
    const category = new Category({
      id: uuidv4(),
      ...dto,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    if (!category.isValid()) {
      throw new Error('Invalid category data');
    }

    return this.categoryRepository.create(category);
  }
}
