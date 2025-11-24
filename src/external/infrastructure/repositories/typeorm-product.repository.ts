import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductRepository } from '@core/domain/repositories/product.repository.interface';
import { Product } from '@core/domain/entities/product.entity';
import { ProductEntity } from '../database/entities/product.entity';

@Injectable()
export class TypeOrmProductRepository implements ProductRepository {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly repository: Repository<ProductEntity>,
  ) {}

  async create(product: Product): Promise<Product> {
    const entity = this.repository.create(product);
    const saved = await this.repository.save(entity);
    return this.toDomain(saved);
  }

  async findById(id: string): Promise<Product | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? this.toDomain(entity) : null;
  }

  async findAll(): Promise<Product[]> {
    const entities = await this.repository.find();
    return entities.map(this.toDomain);
  }

  async findByCategory(categoryId: string): Promise<Product[]> {
    const entities = await this.repository.find({ where: { categoryId } });
    return entities.map(this.toDomain);
  }

  async update(id: string, product: Partial<Product>): Promise<Product> {
    await this.repository.update(id, product);
    const updated = await this.repository.findOne({ where: { id } });
    return this.toDomain(updated!);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  private toDomain(entity: ProductEntity): Product {
    return new Product({
      id: entity.id,
      name: entity.name,
      description: entity.description,
      price: Number(entity.price),
      categoryId: entity.categoryId,
      imageUrl: entity.imageUrl,
      available: entity.available,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }
}
