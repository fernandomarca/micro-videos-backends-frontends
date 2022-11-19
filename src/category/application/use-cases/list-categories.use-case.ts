import { Usecase } from "../../../@seedwork/application/use-case";
import CategoryRepository from "../../../category/domain/repository/CategoryRepository";
import { CategoryOutput, CategoryOutputMapper } from "../dto/category-output.dto";
import { SearchInputDto } from "@seedwork/application/dto/search-input.dto";
import { PaginationOutputDto, PaginationOutputMapper } from "../dto/pagination-output.dto";

export class ListCategoriesUseCase implements Usecase<Input, Output>  {
  constructor(private categoryRepo: CategoryRepository.Repository) { }

  async execute(input: Input): Promise<Output> {
    const params = new CategoryRepository.SearchParams(input);
    const searchResult = await this.categoryRepo.search(params);
    return this.toOutput(searchResult);
  }

  private toOutput(searchResult: CategoryRepository.SearchResult): Output {
    return {
      items: searchResult.items.map((i) => CategoryOutputMapper.toOutput(i)),
      ...PaginationOutputMapper.toOutput(searchResult)
    }
  }
}

export type Input = SearchInputDto;

type Output = PaginationOutputDto<CategoryOutput>;
