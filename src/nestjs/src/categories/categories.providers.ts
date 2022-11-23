import { CreateCategoryUseCase, DeleteCategoryUseCase, GetCategoryUseCase, ListCategoriesUseCase, UpdateCategoryUseCase } from "@fm/micro-videos/category/application";
import { CategoryInMemoryRepository } from "@fm/micro-videos/category/infra";
import CategoryRepository from "@fm/micro-videos/category/domain";

export namespace CATEGORIES_PROVIDERS {
  export namespace REPOSITORIES {
    export const CATEGORY_IN_MEMORY_REPOSITORY = {
      provide: 'CategoryInMemoryRepository',
      useClass: CategoryInMemoryRepository,
    };
  }
  export namespace USE_CASES {
    export const CREATE_CATEGORY_USE_CASE = {
      provide: CreateCategoryUseCase.UseCase,
      useFactory: (categoryRepo: CategoryRepository.CategoryRepository.Repository) => {
        return new CreateCategoryUseCase.UseCase(categoryRepo)
      },
      inject: [REPOSITORIES.CATEGORY_IN_MEMORY_REPOSITORY.provide]
    };
    export const LIST_CATEGORY_USE_CASE = {
      provide: ListCategoriesUseCase.UseCase,
      useFactory: (categoryRepo: CategoryRepository.CategoryRepository.Repository) => {
        return new ListCategoriesUseCase.UseCase(categoryRepo)
      },
      inject: [REPOSITORIES.CATEGORY_IN_MEMORY_REPOSITORY.provide]
    };
    export const UPDATE_CATEGORY_USE_CASE = {
      provide: UpdateCategoryUseCase.UseCase,
      useFactory: (categoryRepo: CategoryRepository.CategoryRepository.Repository) => {
        return new UpdateCategoryUseCase.UseCase(categoryRepo)
      },
      inject: [REPOSITORIES.CATEGORY_IN_MEMORY_REPOSITORY.provide]
    };
    export const GET_CATEGORY_USE_CASE = {
      provide: GetCategoryUseCase.UseCase,
      useFactory: (categoryRepo: CategoryRepository.CategoryRepository.Repository) => {
        return new GetCategoryUseCase.UseCase(categoryRepo)
      },
      inject: [REPOSITORIES.CATEGORY_IN_MEMORY_REPOSITORY.provide]
    };
    export const DELETE_CATEGORY_USE_CASE = {
      provide: DeleteCategoryUseCase.UseCase,
      useFactory: (categoryRepo: CategoryRepository.CategoryRepository.Repository) => {
        return new DeleteCategoryUseCase.UseCase(categoryRepo)
      },
      inject: [REPOSITORIES.CATEGORY_IN_MEMORY_REPOSITORY.provide]
    };
  }
}