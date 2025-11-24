import { Injectable } from '@nestjs/common';
import { ProductRepository } from '@core/domain/repositories/product.repository.interface';
import { CategoryRepository } from '@core/domain/repositories/category.repository.interface';
import { Product } from '@core/domain/entities/product.entity';
import { CreateProductDto } from '../dtos/create-product.dto';
import { CoreResponse } from '@common/types/core-response.type';
import { ResourceNotFoundException } from '@common/exceptions/resource-not-found.exception';
import { ResourceInvalidException } from '@common/exceptions/resource-invalid.exception';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CreateProductUseCase {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async execute(dto: CreateProductDto): Promise<CoreResponse<Product>> {
    const category = await this.categoryRepository.findById(dto.categoryId);
    if (!category) {
      return {
        error: new ResourceNotFoundException(`Category with ID ${dto.categoryId} not found`),
        value: undefined,
      };
    }

    const product = new Product({
      id: uuidv4(),
      ...dto,
      available: dto.available ?? true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    if (!product.isValid()) {
      return {
        error: new ResourceInvalidException('Invalid product data'),
        value: undefined,
      };
    }

    const createdProduct = await this.productRepository.create(product);
    return { error: undefined, value: createdProduct };
  }
}
