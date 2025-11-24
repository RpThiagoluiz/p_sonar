import { Product } from '../entities/product.entity';

export interface ProductRepository {
  create(product: Product): Promise<Product>;
  findById(id: string): Promise<Product | null>;
  findAll(categoryId?: string): Promise<Product[]>;
  update(id: string, product: Partial<Product>): Promise<Product>;
  delete(id: string): Promise<void>;
  findByCategory(categoryId: string): Promise<Product[]>;
}
