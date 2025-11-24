import { Injectable } from '@nestjs/common';
import { CategoryRepository } from '@core/domain/repositories/category.repository.interface';
import { Category } from '@core/domain/entities/category.entity';

@Injectable()
export class ListCategoriesUseCase {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(): Promise<Category[]> {
    return this.categoryRepository.findAll();
  }
}
