import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from '@external/infrastructure/database/entities/product.entity';
import { CategoryEntity } from '@external/infrastructure/database/entities/category.entity';
import { TypeOrmProductRepository } from '@external/infrastructure/repositories/typeorm-product.repository';
import { TypeOrmCategoryRepository } from '@external/infrastructure/repositories/typeorm-category.repository';
import { ProductsController } from '@external/api/controllers/products.controller';
import { CategoriesController } from '@external/api/controllers/categories.controller';
import { CreateProductUseCase } from '@core/application/use-cases/create-product.use-case';
import { GetProductByIdUseCase } from '@core/application/use-cases/get-product-by-id.use-case';
import { ListProductsUseCase } from '@core/application/use-cases/list-products.use-case';
import { UpdateProductUseCase } from '@core/application/use-cases/update-product.use-case';
import { DeleteProductUseCase } from '@core/application/use-cases/delete-product.use-case';
import { CreateCategoryUseCase } from '@core/application/use-cases/create-category.use-case';
import { ListCategoriesUseCase } from '@core/application/use-cases/list-categories.use-case';

const PRODUCT_REPOSITORY = 'ProductRepository';
const CATEGORY_REPOSITORY = 'CategoryRepository';

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity, CategoryEntity])],
  controllers: [ProductsController, CategoriesController],
  providers: [
    {
      provide: PRODUCT_REPOSITORY,
      useClass: TypeOrmProductRepository,
    },
    {
      provide: CATEGORY_REPOSITORY,
      useClass: TypeOrmCategoryRepository,
    },
    {
      provide: CreateProductUseCase,
      useFactory: (productRepo, categoryRepo) => {
        return new CreateProductUseCase(productRepo, categoryRepo);
      },
      inject: [PRODUCT_REPOSITORY, CATEGORY_REPOSITORY],
    },
    {
      provide: GetProductByIdUseCase,
      useFactory: (productRepo) => new GetProductByIdUseCase(productRepo),
      inject: [PRODUCT_REPOSITORY],
    },
    {
      provide: ListProductsUseCase,
      useFactory: (productRepo) => new ListProductsUseCase(productRepo),
      inject: [PRODUCT_REPOSITORY],
    },
    {
      provide: UpdateProductUseCase,
      useFactory: (productRepo) => new UpdateProductUseCase(productRepo),
      inject: [PRODUCT_REPOSITORY],
    },
    {
      provide: DeleteProductUseCase,
      useFactory: (productRepo) => new DeleteProductUseCase(productRepo),
      inject: [PRODUCT_REPOSITORY],
    },
    {
      provide: CreateCategoryUseCase,
      useFactory: (categoryRepo) => new CreateCategoryUseCase(categoryRepo),
      inject: [CATEGORY_REPOSITORY],
    },
    {
      provide: ListCategoriesUseCase,
      useFactory: (categoryRepo) => new ListCategoriesUseCase(categoryRepo),
      inject: [CATEGORY_REPOSITORY],
    },
  ],
  exports: [PRODUCT_REPOSITORY, CATEGORY_REPOSITORY],
})
export class ProductsModule {}
