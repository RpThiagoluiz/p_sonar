import { Injectable } from '@nestjs/common';
import { ProductRepository } from '@core/domain/repositories/product.repository.interface';
import { Product } from '@core/domain/entities/product.entity';

@Injectable()
export class ListProductsUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(categoryId?: string): Promise<Product[]> {
    if (categoryId) {
      return this.productRepository.findByCategory(categoryId);
    }
    return this.productRepository.findAll();
  }
}
