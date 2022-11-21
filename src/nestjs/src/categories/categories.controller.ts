import { CreateCategoryUseCase, ListCategoriesUseCase } from '@fm/micro-videos/category/application';
import { Controller, Get, Post, Body, Patch, Param, Delete, Inject } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
export class CategoriesController {

  @Inject(CategoriesService)
  private readonly categoriesService: CategoriesService;
  @Inject(CreateCategoryUseCase.UseCase)
  private readonly createCategory: CreateCategoryUseCase.UseCase;
  @Inject(ListCategoriesUseCase.UseCase)
  private readonly ListCategory: ListCategoriesUseCase.UseCase;

  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    // return await this.createCategory.execute({ name: "asdasd" });
    return await this.categoriesService.create({ name: "asdasd" });
  }

  @Get()
  findAll() {
    // return this.ListCategory.execute({});
    return this.categoriesService.search({});
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoriesService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(+id);
  }
}
