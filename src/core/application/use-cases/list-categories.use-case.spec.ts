import { ListCategoriesUseCase } from '@core/application/use-cases/list-categories.use-case';
import { CategoryRepository } from '@core/domain/repositories/category.repository.interface';
import { Category } from '@core/domain/entities/category.entity';

describe('ListCategoriesUseCase', () => {
  let useCase: ListCategoriesUseCase;
  let categoryRepository: jest.Mocked<CategoryRepository>;

  beforeEach(() => {
    categoryRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    useCase = new ListCategoriesUseCase(categoryRepository);
  });

  it('should list all categories', async () => {
    const categories = [
      new Category({
        id: '1',
        name: 'Category 1',
        description: 'Description 1',
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
      new Category({
        id: '2',
        name: 'Category 2',
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    ];

    categoryRepository.findAll.mockResolvedValue(categories);

    const result = await useCase.execute();

    expect(categoryRepository.findAll).toHaveBeenCalled();
    expect(result).toEqual(categories);
    expect(result.length).toBe(2);
  });

  it('should return empty array when no categories exist', async () => {
    categoryRepository.findAll.mockResolvedValue([]);

    const result = await useCase.execute();

    expect(result).toEqual([]);
  });
});
