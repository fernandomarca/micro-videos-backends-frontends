import { CreateCategoryUseCase, DeleteCategoryUseCase, GetCategoryUseCase, ListCategoriesUseCase, UpdateCategoryUseCase } from "@fm/micro-videos/category/application";
import { CategoryInMemoryRepository } from "@fm/micro-videos/category/infra";
import { Test, TestingModule } from "@nestjs/testing";
import { CategoriesController } from "../../../categories/categories.controller";
import { CategoriesModule } from "../../../categories/categories.module";
import { ConfigModule } from "../../../config/config.module";
import { DatabaseModule } from "../../../database/database.module";
import { CATEGORIES_PROVIDERS } from '../../categories.providers';

describe('CategoriesController Integration tests', () => {
  let controller: CategoriesController;
  let repository: CategoryInMemoryRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        DatabaseModule,
        CategoriesModule
      ]
    }).compile();

    controller = module.get(CategoriesController);
    repository = module.get(CATEGORIES_PROVIDERS.REPOSITORIES.CATEGORY_REPOSITORY.provide);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(controller['createCategory']).toBeInstanceOf(CreateCategoryUseCase.UseCase);
    expect(controller['updateCategory']).toBeInstanceOf(UpdateCategoryUseCase.UseCase);
    expect(controller['getCategory']).toBeInstanceOf(GetCategoryUseCase.UseCase);
    expect(controller['deleteCategory']).toBeInstanceOf(DeleteCategoryUseCase.UseCase);
    expect(controller['listCategory']).toBeInstanceOf(ListCategoriesUseCase.UseCase);
  });

  describe("should create a category", () => {

    const arrange = [
      {
        request: {
          name: 'Movie'
        },
        expectedOutput: {
          name: "Movie",
          description: null,
          is_active: true,
        }
      },
      {
        request: {
          name: 'Movie',
          description: 'some description',
          is_active: false
        },
        expectedOutput: {
          name: 'Movie',
          description: 'some description',
          is_active: false
        }
      }
    ];

    test.each(arrange)('with request $request', async ({ request, expectedOutput }) => {
      const output = await controller.create(request);
      const entity = await repository.findById(output.id);

      expect(output.id).toBe(entity.id);
      expect(entity).toMatchObject({
        id: output.id,
        name: expectedOutput.name,
        description: expectedOutput.description,
        is_active: expectedOutput.is_active,
        created_at: output.created_at
      });
    });

  });
});