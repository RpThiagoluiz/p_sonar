import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductRepository } from '@core/domain/repositories/product.repository.interface';
import { Product } from '@core/domain/entities/product.entity';

@Injectable()
export class GetProductByIdUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(id: string): Promise<Product> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }
}
