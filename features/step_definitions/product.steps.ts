import { Given, When, Then, Before, setDefaultTimeout } from '@cucumber/cucumber';
import { strict as assert } from 'assert';
import { CreateProductUseCase } from '../../src/core/application/use-cases/create-product.use-case';
import { ListProductsUseCase } from '../../src/core/application/use-cases/list-products.use-case';
import { UpdateProductUseCase } from '../../src/core/application/use-cases/update-product.use-case';
import { Product } from '../../src/core/domain/entities/product.entity';
import { Category } from '../../src/core/domain/entities/category.entity';
import { ProductRepository } from '../../src/core/domain/repositories/product.repository.interface';
import { CategoryRepository } from '../../src/core/domain/repositories/category.repository.interface';

setDefaultTimeout(10000);

class MockProductRepository implements ProductRepository {
  private readonly products: Map<string, Product> = new Map();

  async create(product: Product): Promise<Product> {
    this.products.set(product.id, product);
    return product;
  }

  async findById(id: string): Promise<Product | null> {
    return this.products.get(id) || null;
  }

  async findAll(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async findByCategory(categoryId: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter((p) => p.categoryId === categoryId);
  }

  async update(id: string, data: Partial<Product>): Promise<Product> {
    const product = this.products.get(id);
    if (!product) throw new Error('Product not found');
    const updated = { ...product, ...data };
    this.products.set(id, updated as Product);
    return updated as Product;
  }

  async delete(id: string): Promise<void> {
    this.products.delete(id);
  }

  clear() {
    this.products.clear();
  }
}

class MockCategoryRepository implements CategoryRepository {
  private readonly categories: Map<string, Category> = new Map();

  async create(category: Category): Promise<Category> {
    this.categories.set(category.id, category);
    return category;
  }

  async findById(id: string): Promise<Category | null> {
    return this.categories.get(id) || null;
  }

  async findAll(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async update(id: string, data: Partial<Category>): Promise<Category> {
    const category = this.categories.get(id);
    if (!category) throw new Error('Category not found');
    const updated = { ...category, ...data };
    this.categories.set(id, updated as Category);
    return updated as Category;
  }

  async delete(id: string): Promise<void> {
    this.categories.delete(id);
  }

  clear() {
    this.categories.clear();
  }
}

const productRepository = new MockProductRepository();
const categoryRepository = new MockCategoryRepository();

let createProductUseCase: CreateProductUseCase;
let listProductsUseCase: ListProductsUseCase;
let updateProductUseCase: UpdateProductUseCase;
let createdProduct: Product;
let productList: Product[];
let error: Error | null = null;

Before(() => {
  productRepository.clear();
  categoryRepository.clear();
  createProductUseCase = new CreateProductUseCase(productRepository, categoryRepository);
  listProductsUseCase = new ListProductsUseCase(productRepository);
  updateProductUseCase = new UpdateProductUseCase(productRepository);
  error = null;
});

Given('a category with id {string} exists', async (id: string) => {
  const category = new Category({
    id,
    name: 'Test Category',
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  await categoryRepository.create(category);
});

Given('a product with id {string} exists with price {float}', async (id: string, price: number) => {
  const product = new Product({
    id,
    name: 'Test Product',
    description: 'Test Description',
    price,
    categoryId: '123e4567-e89b-12d3-a456-426614174000',
    available: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  await productRepository.create(product);
});

Given('the following products exist:', async (dataTable: any) => {
  const rows = dataTable.hashes();
  for (const row of rows) {
    const product = new Product({
      id: Math.random().toString(),
      name: row.name,
      description: row.description,
      price: parseFloat(row.price),
      categoryId: row.categoryId,
      available: row.available === 'true',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await productRepository.create(product);
  }
});

When('I create a product with the following details:', async (dataTable: any) => {
  const data = dataTable.rowsHash();
  try {
    createdProduct = await createProductUseCase.execute({
      name: data.name,
      description: data.description,
      price: parseFloat(data.price),
      categoryId: data.categoryId,
      available: data.available === 'true',
    });
  } catch (e) {
    error = e as Error;
  }
});

When('I try to create a product with invalid data:', async (dataTable: any) => {
  const data = dataTable.rowsHash();
  try {
    await createProductUseCase.execute({
      name: data.name || '',
      description: data.description,
      price: parseFloat(data.price) || 0,
      categoryId: data.categoryId,
      available: true,
    });
  } catch (e) {
    error = e as Error;
  }
});

When('I list products for category {string}', async (categoryId: string) => {
  productList = await listProductsUseCase.execute(categoryId);
});

When('I update the product price to {float}', async (newPrice: number) => {
  await updateProductUseCase.execute('987e6543-e21b-12d3-a456-426614174000', { price: newPrice });
});

Then('the product should be created successfully', () => {
  assert.ok(createdProduct, 'Product should be created');
  assert.ok(createdProduct.id, 'Product should have an ID');
});

Then('the product should have the name {string}', (name: string) => {
  assert.strictEqual(createdProduct.name, name);
});

Then('the product should have the price {float}', (price: number) => {
  assert.strictEqual(createdProduct.price, price);
});

Then('I should see {int} products', (count: number) => {
  assert.strictEqual(productList.length, count);
});

Then('the first product should be {string}', (name: string) => {
  assert.strictEqual(productList[0].name, name);
});

Then('the product price should be {float}', async (price: number) => {
  const product = await productRepository.findById('987e6543-e21b-12d3-a456-426614174000');
  assert.strictEqual(product?.price, price);
});

Then('the product creation should fail', () => {
  assert.ok(error !== null, 'Error should not be null');
});
