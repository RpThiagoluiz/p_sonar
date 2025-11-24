/* eslint-disable no-undef */
import { ListProductsUseCase } from '@core/application/use-cases/list-products.use-case';
import { ProductRepository } from '@core/domain/repositories/product.repository.interface';
import { Product } from '@core/domain/entities/product.entity';

describe('ListProductsUseCase', () => {
  let useCase: ListProductsUseCase;
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

    useCase = new ListProductsUseCase(productRepository);
  });

  it('should list all products when no category is specified', async () => {
    const products = [
      new Product({
        id: '1',
        name: 'Product 1',
        description: 'Description 1',
        price: 10,
        categoryId: 'cat1',
        available: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
      new Product({
        id: '2',
        name: 'Product 2',
        description: 'Description 2',
        price: 20,
        categoryId: 'cat2',
        available: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    ];

    productRepository.findAll.mockResolvedValue(products);

    const result = await useCase.execute();

    expect(productRepository.findAll).toHaveBeenCalled();
    expect(result).toEqual(products);
  });

  it('should list products by category when categoryId is provided', async () => {
    const products = [
      new Product({
        id: '1',
        name: 'Product 1',
        description: 'Description 1',
        price: 10,
        categoryId: 'cat1',
        available: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    ];

    productRepository.findByCategory.mockResolvedValue(products);

    const result = await useCase.execute('cat1');

    expect(productRepository.findByCategory).toHaveBeenCalledWith('cat1');
    expect(result).toEqual(products);
  });

  it('should return empty array when no products exist', async () => {
    productRepository.findAll.mockResolvedValue([]);

    const result = await useCase.execute();

    expect(result).toEqual([]);
  });
});
