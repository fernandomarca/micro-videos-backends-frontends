import { CreateCategoryUseCase, DeleteCategoryUseCase, GetCategoryUseCase, ListCategoriesUseCase, UpdateCategoryUseCase } from "@fm/micro-videos/category/application";
import { CategoryInMemoryRepository, CategorySequelize } from "@fm/micro-videos/category/infra";
import { Test, TestingModule } from "@nestjs/testing";
import { CategoriesController } from "../../../categories/categories.controller";
import { CategoriesModule } from "../../../categories/categories.module";
import { ConfigModule } from "../../../config/config.module";
import { DatabaseModule } from "../../../database/database.module";
import { CATEGORIES_PROVIDERS } from '../../categories.providers';
import { NotFoundError } from '@fm/micro-videos/@seedwork/domain';
import { Category } from "@fm/micro-videos/category/domain";

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
      const presenter = await controller.create(request);
      const entity = await repository.findById(presenter.id);

      expect(presenter.id).toBe(entity.id);
      expect(entity).toMatchObject({
        id: presenter.id,
        name: expectedOutput.name,
        description: expectedOutput.description,
        is_active: expectedOutput.is_active,
        created_at: presenter.created_at
      });
    });
  });

  describe("should update a category", () => {
    // let category: CategorySequelize.CategoryModel;
    const category = Category.fake().aCategory().build();
    beforeEach(async () => {
      // category = await CategorySequelize.CategoryModel.factory().create();
      await repository.insert(category);
    });

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
      const presenter = await controller.update(category.id, request);
      const entity = await repository.findById(presenter.id);

      expect(presenter.id).toBe(entity.id);
      expect(entity).toMatchObject({
        id: presenter.id,
        name: expectedOutput.name,
        description: expectedOutput.description,
        is_active: expectedOutput.is_active,
        created_at: presenter.created_at
      });
    });

  });

  it('should delete a category', async () => {
    const category = Category.fake().aCategory().build();
    await repository.insert(category);
    const response = await controller.remove(category.id);
    expect(response).not.toBeDefined();
    await expect(repository.findById(category.id)).rejects.toThrow(
      new NotFoundError(`Entity Not Found using ID ${category.id}`)
    )
  });

  it('should get a category', async () => {
    const category = Category.fake().aCategory().build();
    await repository.insert(category);
    const presenter = await controller.findOne(category.id);

    expect(presenter.id).toBe(category.id);
    expect(category).toMatchObject({
      id: presenter.id,
      name: presenter.name,
      description: presenter.description,
      is_active: presenter.is_active,
      created_at: presenter.created_at
    });
  });
});