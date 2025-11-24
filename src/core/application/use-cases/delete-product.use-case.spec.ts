import { NotFoundException } from '@nestjs/common';
import { DeleteProductUseCase } from '@core/application/use-cases/delete-product.use-case';
import { ProductRepository } from '@core/domain/repositories/product.repository.interface';
import { Product } from '@core/domain/entities/product.entity';

describe('DeleteProductUseCase', () => {
  let useCase: DeleteProductUseCase;
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

    useCase = new DeleteProductUseCase(productRepository);
  });

  it('should delete a product successfully', async () => {
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
    productRepository.delete.mockResolvedValue(undefined);

    await useCase.execute('123');

    expect(productRepository.findById).toHaveBeenCalledWith('123');
    expect(productRepository.delete).toHaveBeenCalledWith('123');
  });

  it('should throw NotFoundException when product not found', async () => {
    productRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute('nonexistent')).rejects.toThrow(NotFoundException);
    expect(productRepository.delete).not.toHaveBeenCalled();
  });
});
