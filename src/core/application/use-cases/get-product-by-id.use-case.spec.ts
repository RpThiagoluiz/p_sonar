import { NotFoundException } from '@nestjs/common';
import { GetProductByIdUseCase } from '@core/application/use-cases/get-product-by-id.use-case';
import { ProductRepository } from '@core/domain/repositories/product.repository.interface';
import { Product } from '@core/domain/entities/product.entity';

describe('GetProductByIdUseCase', () => {
  let useCase: GetProductByIdUseCase;
  let productRepository: jest.Mocked<ProductRepository>;

  beforeEach(() => {
    productRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findByCategory: jest.fn(),
    };

    useCase = new GetProductByIdUseCase(productRepository);
  });

  it('should return a product when found', async () => {
    const product = new Product({
      id: '123',
      name: 'Test Product',
      description: 'Test Description',
      price: 10.99,
      categoryId: 'cat1',
      available: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    productRepository.findById.mockResolvedValue(product);

    const result = await useCase.execute('123');

    expect(productRepository.findById).toHaveBeenCalledWith('123');
    expect(result).toEqual(product);
  });

  it('should throw NotFoundException when product not found', async () => {
    productRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute('nonexistent')).rejects.toThrow(NotFoundException);
    await expect(useCase.execute('nonexistent')).rejects.toThrow(
      'Product with ID nonexistent not found',
    );
  });
});
