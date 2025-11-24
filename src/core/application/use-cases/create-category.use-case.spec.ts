import { CreateCategoryUseCase } from '@core/application/use-cases/create-category.use-case';
import { CategoryRepository } from '@core/domain/repositories/category.repository.interface';
import { Category } from '@core/domain/entities/category.entity';
import { CreateCategoryDto } from '@core/application/dtos/create-category.dto';

describe('CreateCategoryUseCase', () => {
  let useCase: CreateCategoryUseCase;
  let categoryRepository: jest.Mocked<CategoryRepository>;

  beforeEach(() => {
    categoryRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    useCase = new CreateCategoryUseCase(categoryRepository);
  });

  it('should create a category successfully', async () => {
    const dto: CreateCategoryDto = {
      name: 'Test Category',
      description: 'Test Description',
    };

    const expectedCategory = new Category({
      id: expect.any(String),
      ...dto,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });

    categoryRepository.create.mockResolvedValue(expectedCategory);

    const result = await useCase.execute(dto);

    expect(categoryRepository.create).toHaveBeenCalled();
    expect(result).toEqual(expectedCategory);
  });

  it('should throw error if category data is invalid', async () => {
    const dto: CreateCategoryDto = {
      name: '',
    };

    await expect(useCase.execute(dto)).rejects.toThrow('Invalid category data');
    expect(categoryRepository.create).not.toHaveBeenCalled();
  });
});
