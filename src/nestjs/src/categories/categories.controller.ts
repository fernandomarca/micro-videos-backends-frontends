import {
  CreateCategoryUseCase,
  ListCategoriesUseCase,
  UpdateCategoryUseCase,
  GetCategoryUseCase,
  DeleteCategoryUseCase
} from '@fm/micro-videos/category/application';
import { Controller, Get, Post, Body, Param, Delete, Inject, Put, HttpCode, Query } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { SearchCategoryDto } from './dto/search-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
export class CategoriesController {

  @Inject(CategoriesService)
  private readonly categoriesService: CategoriesService;

  @Inject(CreateCategoryUseCase.UseCase)
  private readonly createCategory: CreateCategoryUseCase.UseCase;
  @Inject(ListCategoriesUseCase.UseCase)
  private readonly listCategory: ListCategoriesUseCase.UseCase;
  @Inject(UpdateCategoryUseCase.UseCase)
  private readonly updateCategory: UpdateCategoryUseCase.UseCase;
  @Inject(GetCategoryUseCase.UseCase)
  private readonly getCategory: GetCategoryUseCase.UseCase;
  @Inject(DeleteCategoryUseCase.UseCase)
  private readonly deleteCategory: DeleteCategoryUseCase.UseCase;

  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    return await this.createCategory.execute(createCategoryDto);
    // return await this.categoriesService.create({ name: "asdasd" });
  }

  @Get()
  search(
    @Query()
    SearchParams: SearchCategoryDto
  ) {
    return this.listCategory.execute(SearchParams);
    // return this.categoriesService.search({});
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.getCategory.execute({ id });
  }

  @Put(':id')
  update(
    @Param('id')
    id: string,
    @Body()
    updateCategoryDto: UpdateCategoryDto) {
    return this.updateCategory.execute({
      id,
      ...updateCategoryDto
    });
  }

  @HttpCode(204)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.deleteCategory.execute({ id });
  }
}
