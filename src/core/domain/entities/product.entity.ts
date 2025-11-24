export class Product {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  imageUrl?: string;
  available: boolean;
  prepTime: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: Partial<Product>) {
    Object.assign(this, data);
  }

  isValid(): boolean {
    return !!(this.name && this.price > 0 && this.categoryId && this.prepTime > 0);
  }

  updatePrice(newPrice: number): void {
    if (newPrice <= 0) {
      throw new Error('Price must be greater than zero');
    }
    this.price = newPrice;
    this.updatedAt = new Date();
  }

  toggleAvailability(): void {
    this.available = !this.available;
    this.updatedAt = new Date();
  }
}
