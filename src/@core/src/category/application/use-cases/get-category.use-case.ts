import { Usecase } from "../../../@seedwork/application/use-case";
import CategoryRepository from "category/domain/repository/CategoryRepository";
import { CategoryOutput, CategoryOutputMapper } from "../dto/category-output.dto";

export class GetCategoryUseCase implements Usecase<Input, Output>  {
  constructor(private categoryRepo: CategoryRepository.Repository) { }

  async execute(input: Input): Promise<Output> {
    const entity = await this.categoryRepo.findById(input.id);
    return CategoryOutputMapper.toOutput(entity);
  }
}

export type Input = {
  id: string;
}

type Output = CategoryOutput;
