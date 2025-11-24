import { IsString, IsNumber, IsBoolean, IsOptional, IsUUID, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ description: 'Product name', example: 'Hamburger' })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Product description',
    example: 'Delicious beef burger',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Product price',
    example: 15.99,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({
    description: 'Preparation time in minutes',
    example: 15,
    minimum: 1,
  })
  @IsNumber()
  @Min(1)
  prepTime: number;

  @ApiProperty({
    description: 'Category UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  categoryId: string;

  @ApiPropertyOptional({
    description: 'Product image URL',
    example: 'https://example.com/image.jpg',
  })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiPropertyOptional({
    description: 'Product availability',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  available?: boolean = true;
}
