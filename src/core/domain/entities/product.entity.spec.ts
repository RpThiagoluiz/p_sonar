/* eslint-disable no-undef */
import { Product } from '@core/domain/entities/product.entity';

describe('Product Entity', () => {
  describe('isValid', () => {
    it('should return true for valid product', () => {
      const product = new Product({
        id: '123',
        name: 'Test Product',
        description: 'Test Description',
        price: 10.99,
        categoryId: '456',
        available: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      expect(product.isValid()).toBe(true);
    });

    it('should return false for product without name', () => {
      const product = new Product({
        id: '123',
        name: '',
        description: 'Test Description',
        price: 10.99,
        categoryId: '456',
        available: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      expect(product.isValid()).toBe(false);
    });

    it('should return false for product with zero price', () => {
      const product = new Product({
        id: '123',
        name: 'Test Product',
        description: 'Test Description',
        price: 0,
        categoryId: '456',
        available: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      expect(product.isValid()).toBe(false);
    });

    it('should return false for product without categoryId', () => {
      const product = new Product({
        id: '123',
        name: 'Test Product',
        description: 'Test Description',
        price: 10.99,
        categoryId: '',
        available: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      expect(product.isValid()).toBe(false);
    });
  });

  describe('updatePrice', () => {
    it('should update price and updatedAt', async () => {
      const product = new Product({
        id: '123',
        name: 'Test Product',
        description: 'Test Description',
        price: 10.99,
        categoryId: '456',
        available: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const oldUpdatedAt = product.updatedAt.getTime();
      await new Promise((resolve) => setTimeout(resolve, 10));
      product.updatePrice(15.99);

      expect(product.price).toBe(15.99);
      expect(product.updatedAt.getTime()).toBeGreaterThan(oldUpdatedAt);
    });

    it('should throw error for zero or negative price', () => {
      const product = new Product({
        id: '123',
        name: 'Test Product',
        description: 'Test Description',
        price: 10.99,
        categoryId: '456',
        available: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      expect(() => product.updatePrice(0)).toThrow('Price must be greater than zero');
      expect(() => product.updatePrice(-5)).toThrow('Price must be greater than zero');
    });
  });

  describe('toggleAvailability', () => {
    it('should toggle availability from true to false', () => {
      const product = new Product({
        id: '123',
        name: 'Test Product',
        description: 'Test Description',
        price: 10.99,
        categoryId: '456',
        available: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      product.toggleAvailability();
      expect(product.available).toBe(false);
    });

    it('should toggle availability from false to true', () => {
      const product = new Product({
        id: '123',
        name: 'Test Product',
        description: 'Test Description',
        price: 10.99,
        categoryId: '456',
        available: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      product.toggleAvailability();
      expect(product.available).toBe(true);
    });

    it('should update updatedAt when toggling availability', async () => {
      const product = new Product({
        id: '123',
        name: 'Test Product',
        description: 'Test Description',
        price: 10.99,
        categoryId: '456',
        available: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const oldUpdatedAt = product.updatedAt.getTime();
      await new Promise((resolve) => setTimeout(resolve, 10));
      product.toggleAvailability();

      expect(product.updatedAt.getTime()).toBeGreaterThan(oldUpdatedAt);
    });
  });
});
