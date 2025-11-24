import { NotFoundException } from '@nestjs/common';
import { UpdateProductUseCase } from '@core/application/use-cases/update-product.use-case';
import { ProductRepository } from '@core/domain/repositories/product.repository.interface';
import { Product } from '@core/domain/entities/product.entity';
import { UpdateProductDto } from '@core/application/dtos/update-product.dto';

describe('UpdateProductUseCase', () => {
  let useCase: UpdateProductUseCase;
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

    useCase = new UpdateProductUseCase(productRepository);
  });

  it('should update a product successfully', async () => {
    const existingProduct = new Product({
      id: '123',
      name: 'Old Name',
      description: 'Old Description',
      price: 10.99,
      categoryId: 'cat1',
      available: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const dto: UpdateProductDto = {
      name: 'New Name',
      price: 15.99,
    };

    const updatedProduct = new Product({
      ...existingProduct,
      ...dto,
      updatedAt: new Date(),
    });

    productRepository.findById.mockResolvedValue(existingProduct);
    productRepository.update.mockResolvedValue(updatedProduct);

    const result = await useCase.execute('123', dto);

    expect(productRepository.findById).toHaveBeenCalledWith('123');
    expect(productRepository.update).toHaveBeenCalledWith('123', {
      ...dto,
      updatedAt: expect.any(Date),
    });
    expect(result).toEqual(updatedProduct);
  });

  it('should throw NotFoundException when product not found', async () => {
    const dto: UpdateProductDto = {
      name: 'New Name',
    };

    productRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute('nonexistent', dto)).rejects.toThrow(NotFoundException);
    expect(productRepository.update).not.toHaveBeenCalled();
  });
});
