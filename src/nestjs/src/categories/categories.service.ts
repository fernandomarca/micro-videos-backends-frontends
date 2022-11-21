import { CreateCategoryUseCase, ListCategoriesUseCase } from '@fm/micro-videos/category/application';
import { Inject, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {

  @Inject(CreateCategoryUseCase.UseCase)
  private readonly createCategoryUseCase: CreateCategoryUseCase.UseCase;
  @Inject(ListCategoriesUseCase.UseCase)
  private readonly ListCategoryUseCase: ListCategoriesUseCase.UseCase;

  create(createCategoryDto: CreateCategoryUseCase.Input) {
    return this.createCategoryUseCase.execute(createCategoryDto);
  }

  search(input: ListCategoriesUseCase.Input) {
    return this.ListCategoryUseCase.execute(input);
  }

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
