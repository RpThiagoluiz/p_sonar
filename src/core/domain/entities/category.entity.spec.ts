import { Category } from '@core/domain/entities/category.entity';

describe('Category Entity', () => {
  describe('isValid', () => {
    it('should return true for valid category', () => {
      const category = new Category({
        id: '123',
        name: 'Test Category',
        description: 'Test Description',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      expect(category.isValid()).toBe(true);
    });

    it('should return false for category without name', () => {
      const category = new Category({
        id: '123',
        name: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      expect(category.isValid()).toBe(false);
    });

    it('should be valid even without description', () => {
      const category = new Category({
        id: '123',
        name: 'Test Category',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      expect(category.isValid()).toBe(true);
    });
  });
});
