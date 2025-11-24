export class Category {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: Partial<Category>) {
    Object.assign(this, data);
  }

  isValid(): boolean {
    return !!this.name;
  }
}
