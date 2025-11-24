import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryRepository } from '@core/domain/repositories/category.repository.interface';
import { Category } from '@core/domain/entities/category.entity';
import { CategoryEntity } from '../database/entities/category.entity';

@Injectable()
export class TypeOrmCategoryRepository implements CategoryRepository {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly repository: Repository<CategoryEntity>,
  ) {}

  async create(category: Category): Promise<Category> {
    try {
      // Check if category with same name already exists
      const existing = await this.repository.findOne({
        where: { name: category.name },
      });

      if (existing) {
        throw new ConflictException(`Category with name '${category.name}' already exists`);
      }

      const entity = this.repository.create(category);
      const saved = await this.repository.save(entity);
      return this.toDomain(saved);
    } catch (error) {
      // If it's already a ConflictException, just rethrow it
      if (error instanceof ConflictException) {
        throw error;
      }

      // Handle PostgreSQL unique constraint violation
      if (error.code === '23505' || error.message?.includes('duplicate key')) {
        throw new ConflictException(`Category with name '${category.name}' already exists`);
      }
      throw error;
    }
  }

  async findById(id: string): Promise<Category | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? this.toDomain(entity) : null;
  }

  async findAll(): Promise<Category[]> {
    const entities = await this.repository.find();
    return entities.map(this.toDomain);
  }

  async update(id: string, category: Partial<Category>): Promise<Category> {
    await this.repository.update(id, category);
    const updated = await this.repository.findOne({ where: { id } });
    return this.toDomain(updated!);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  private toDomain(entity: CategoryEntity): Category {
    return new Category({
      id: entity.id,
      name: entity.name,
      description: entity.description,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }
}
