/* eslint-disable no-undef */
import { CreateProductUseCase } from '@core/application/use-cases/create-product.use-case';
import { ProductRepository } from '@core/domain/repositories/product.repository.interface';
import { CategoryRepository } from '@core/domain/repositories/category.repository.interface';
import { Product } from '@core/domain/entities/product.entity';
import { Category } from '@core/domain/entities/category.entity';
import { CreateProductDto } from '@core/application/dtos/create-product.dto';
import { ResourceNotFoundException } from '@common/exceptions/resource-not-found.exception';
import { ResourceInvalidException } from '@common/exceptions/resource-invalid.exception';

describe('CreateProductUseCase', () => {
  let useCase: CreateProductUseCase;
  let productRepository: jest.Mocked<ProductRepository>;
  let categoryRepository: jest.Mocked<CategoryRepository>;

  beforeEach(() => {
    productRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findByCategory: jest.fn(),
    };

    categoryRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    useCase = new CreateProductUseCase(productRepository, categoryRepository);
  });

  it('should create a product successfully', async () => {
    const category = new Category({
      id: '456',
      name: 'Test Category',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const dto: CreateProductDto = {
      name: 'Test Product',
      description: 'Test Description',
      price: 10.99,
      prepTime: 15,
      categoryId: '456',
      available: true,
    };

    const expectedProduct = new Product({
      id: expect.any(String),
      ...dto,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });

    categoryRepository.findById.mockResolvedValue(category);
    productRepository.create.mockResolvedValue(expectedProduct);

    const result = await useCase.execute(dto);

    expect(result.error).toBeUndefined();
    expect(result.value).toEqual(expectedProduct);
    expect(categoryRepository.findById).toHaveBeenCalledWith('456');
    expect(productRepository.create).toHaveBeenCalled();
  });

  it('should return error if category does not exist', async () => {
    const dto: CreateProductDto = {
      name: 'Test Product',
      description: 'Test Description',
      price: 10.99,
      prepTime: 15,
      categoryId: '456',
      available: true,
    };

    categoryRepository.findById.mockResolvedValue(null);

    const result = await useCase.execute(dto);

    expect(result.error).toBeInstanceOf(ResourceNotFoundException);
    expect(result.error?.code).toBe('NF404');
    expect(result.error?.message).toContain('456');
    expect(result.value).toBeUndefined();
    expect(categoryRepository.findById).toHaveBeenCalledWith('456');
    expect(productRepository.create).not.toHaveBeenCalled();
  });

  it('should return error if product data is invalid', async () => {
    const category = new Category({
      id: '456',
      name: 'Test Category',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const dto: CreateProductDto = {
      name: '',
      description: 'Test Description',
      price: 0,
      prepTime: 0,
      categoryId: '456',
      available: true,
    };

    categoryRepository.findById.mockResolvedValue(category);

    const result = await useCase.execute(dto);

    expect(result.error).toBeInstanceOf(ResourceInvalidException);
    expect(result.error?.code).toBe('RIE400');
    expect(result.value).toBeUndefined();
    expect(productRepository.create).not.toHaveBeenCalled();
  });
});
