import { Usecase } from "../../../@seedwork/application/use-case";
import CategoryRepository from "../../../category/domain/repository/CategoryRepository";
import { CategoryOutput, CategoryOutputMapper } from "../dto/category-output.dto";
import { SearchInputDto } from "@seedwork/application/dto/search-input.dto";
import { PaginationOutputDto, PaginationOutputMapper } from "../dto/pagination-output.dto";

export namespace ListCategoriesUseCase {
  export class UseCase implements Usecase<Input, Output>  {
    constructor(private categoryRepo: CategoryRepository.Repository) { }

    async execute(input: Input): Promise<Output> {
      const params = new CategoryRepository.SearchParams(input);
      const searchResult = await this.categoryRepo.search(params);
      return this.toOutput(searchResult);
    }

    private toOutput(searchResult: CategoryRepository.SearchResult): Output {
      const { items: _items, filter, sort, ...otherProps } = searchResult;
      const items = searchResult.items.map((i) => {
        return CategoryOutputMapper.toOutput(i);
      });
      return PaginationOutputMapper.toOutput({ items, ...otherProps })
    }
  }

  export type Input = SearchInputDto;

  export type Output = PaginationOutputDto<CategoryOutput>;
}

export default ListCategoriesUseCase;