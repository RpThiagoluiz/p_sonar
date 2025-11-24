import { IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ description: 'Category name', example: 'Burgers' })
  @IsString()
  name: string;

  @ApiPropertyOptional({
    description: 'Category description',
    example: 'All types of burgers',
  })
  @IsOptional()
  @IsString()
  description?: string;
}
