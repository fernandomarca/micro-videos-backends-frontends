import CategoryRepository from "../../../category/domain/repository/CategoryRepository";
import { Usecase as DefaultUsecase } from "../../../@seedwork/application/use-case";

export namespace DeleteCategoryUseCase {
  export class UseCase implements DefaultUsecase<Input, Output> {
    constructor(private categoryRepository: CategoryRepository.Repository) { }

    async execute(input: Input): Promise<Output> {
      const entity = await this.categoryRepository.findById(input.id);
      await this.categoryRepository.delete(entity.id);
    }
  }

  export type Input = {
    id: string;
  };

  type Output = void;
}


export default DeleteCategoryUseCase;