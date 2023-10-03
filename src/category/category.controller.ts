import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { SkipToken } from 'src/auth/skip-token.decorator';
import { Category } from './schemas/category.shema';

@SkipToken()
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createCategoryDto: CreateCategoryDto
    ) : Promise<Category>{
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll() : Promise<Category[]> {
    return this.categoryService.findAllRoot();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findChild(@Param('id') id: string) : Promise<Category[]>{
    return this.categoryService.findChild(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto
    ) : Promise<Category> {
    return this.categoryService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    return this.categoryService.deleteCategoryAndDescendants(id);
  }
}
