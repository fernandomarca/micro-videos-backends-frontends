import {
  CreateCategoryUseCase,
  ListCategoriesUseCase,
  UpdateCategoryUseCase,
  GetCategoryUseCase,
  DeleteCategoryUseCase,
  CategoryOutput
} from '@fm/micro-videos/category/application';
import { Controller, Get, Post, Body, Param, Delete, Inject, Put, HttpCode, Query } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { SearchCategoryDto } from './dto/search-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryCollectionPresenter, CategoryPresenter } from './presenter/category.presenter';

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
    const output = await this.createCategory.execute(createCategoryDto);
    return CategoriesController.categoryToResponse(output);
    // return await this.categoriesService.create({ name: "asdasd" });
  }

  @Get()
  async search(
    @Query()
    SearchParams: SearchCategoryDto
  ) {
    const output = await this.listCategory.execute(SearchParams);
    return new CategoryCollectionPresenter(output);
    // return this.categoriesService.search({});
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const output = await this.getCategory.execute({ id });
    return CategoriesController.categoryToResponse(output);
  }

  @Put(':id')
  async update(
    @Param('id')
    id: string,
    @Body()
    updateCategoryDto: UpdateCategoryDto) {
    const output = await this.updateCategory.execute({
      id,
      ...updateCategoryDto
    });
    return CategoriesController.categoryToResponse(output);
  }

  @HttpCode(204)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.deleteCategory.execute({ id });
  }

  static categoryToResponse(output: CategoryOutput) {
    return new CategoryPresenter(output);
  }
}
