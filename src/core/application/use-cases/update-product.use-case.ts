import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductRepository } from '@core/domain/repositories/product.repository.interface';
import { Product } from '@core/domain/entities/product.entity';
import { UpdateProductDto } from '../dtos/update-product.dto';

@Injectable()
export class UpdateProductUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(id: string, dto: UpdateProductDto): Promise<Product> {
    const existingProduct = await this.productRepository.findById(id);
    if (!existingProduct) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return this.productRepository.update(id, {
      ...dto,
      updatedAt: new Date(),
    });
  }
}
