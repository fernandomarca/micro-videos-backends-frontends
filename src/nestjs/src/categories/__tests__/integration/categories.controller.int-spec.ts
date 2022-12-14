import { CreateCategoryUseCase, DeleteCategoryUseCase, GetCategoryUseCase, ListCategoriesUseCase, UpdateCategoryUseCase } from "@fm/micro-videos/category/application";
import { Test, TestingModule } from "@nestjs/testing";
import { CategoriesController } from "../../../categories/categories.controller";
import { CategoriesModule } from "../../../categories/categories.module";
import { ConfigModule } from "../../../config/config.module";
import { DatabaseModule } from "../../../database/database.module";

describe('CategoriesController Integration tests', () => {
  let controller: CategoriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        DatabaseModule,
        CategoriesModule
      ]
    }).compile();

    controller = module.get(CategoriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(controller['createCategory']).toBeInstanceOf(CreateCategoryUseCase.UseCase);
    expect(controller['updateCategory']).toBeInstanceOf(UpdateCategoryUseCase.UseCase);
    expect(controller['getCategory']).toBeInstanceOf(GetCategoryUseCase.UseCase);
    expect(controller['deleteCategory']).toBeInstanceOf(DeleteCategoryUseCase.UseCase);
    expect(controller['listCategory']).toBeInstanceOf(ListCategoriesUseCase.UseCase);
  });
});