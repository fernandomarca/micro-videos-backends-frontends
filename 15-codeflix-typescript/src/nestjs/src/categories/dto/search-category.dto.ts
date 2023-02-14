import { ListCategoriesUseCase } from "@fm/micro-videos/category/application";
import { SortDirection } from "@fm/micro-videos/dist/@seedwork/domain/repository/repository-contracts";

export class SearchCategoryDto implements ListCategoriesUseCase.Input {
  page?: number;
  per_page?: number;
  sort?: string | null;
  sort_dir?: SortDirection | null;
  filter?: string;
}