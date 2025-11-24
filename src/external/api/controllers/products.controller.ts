import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { CreateProductDto } from '@core/application/dtos/create-product.dto';
import { UpdateProductDto } from '@core/application/dtos/update-product.dto';
import { CreateProductUseCase } from '@core/application/use-cases/create-product.use-case';
import { GetProductByIdUseCase } from '@core/application/use-cases/get-product-by-id.use-case';
import { ListProductsUseCase } from '@core/application/use-cases/list-products.use-case';
import { UpdateProductUseCase } from '@core/application/use-cases/update-product.use-case';
import { DeleteProductUseCase } from '@core/application/use-cases/delete-product.use-case';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(
    private readonly createProductUseCase: CreateProductUseCase,
    private readonly getProductByIdUseCase: GetProductByIdUseCase,
    private readonly listProductsUseCase: ListProductsUseCase,
    private readonly updateProductUseCase: UpdateProductUseCase,
    private readonly deleteProductUseCase: DeleteProductUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({ status: 201, description: 'Product created successfully' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  @ApiResponse({ status: 400, description: 'Invalid product data' })
  async create(@Body() dto: CreateProductDto) {
    try {
      const result = await this.createProductUseCase.execute(dto);

      if (result.error) {
        throw new HttpException(
          {
            statusCode: this.getStatusCodeFromError(result.error.code),
            message: result.error.message,
            error: result.error.shortMessage,
          },
          this.getStatusCodeFromError(result.error.code),
        );
      }

      return result.value;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Something went wrong while creating product',
          error: 'Internal Server Error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private getStatusCodeFromError(code: string): number {
    const statusMap: Record<string, number> = {
      NF404: HttpStatus.NOT_FOUND,
      RIE400: HttpStatus.BAD_REQUEST,
      RC409: HttpStatus.CONFLICT,
      UERR: HttpStatus.INTERNAL_SERVER_ERROR,
    };
    return statusMap[code] || HttpStatus.INTERNAL_SERVER_ERROR;
  }

  @Get()
  @ApiOperation({ summary: 'List all products' })
  @ApiResponse({ status: 200, description: 'List of products' })
  @ApiQuery({
    name: 'categoryId',
    required: false,
    description: 'Filter products by category ID',
    type: String,
  })
  async findAll(@Query('categoryId') categoryId?: string) {
    return this.listProductsUseCase.execute(categoryId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product by ID' })
  @ApiResponse({ status: 200, description: 'Product found' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async findOne(@Param('id') id: string) {
    return this.getProductByIdUseCase.execute(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a product' })
  @ApiResponse({ status: 200, description: 'Product updated successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.updateProductUseCase.execute(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a product' })
  @ApiResponse({ status: 204, description: 'Product deleted successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async remove(@Param('id') id: string) {
    return this.deleteProductUseCase.execute(id);
  }
}
