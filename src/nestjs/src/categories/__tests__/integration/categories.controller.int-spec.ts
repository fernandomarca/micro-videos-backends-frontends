import { CreateCategoryUseCase, DeleteCategoryUseCase, GetCategoryUseCase, ListCategoriesUseCase, UpdateCategoryUseCase } from "@fm/micro-videos/category/application";
import { CategoryInMemoryRepository } from "@fm/micro-videos/category/infra";
import { Test, TestingModule } from "@nestjs/testing";
import { CategoriesController } from "../../../categories/categories.controller";
import { CategoriesModule } from "../../../categories/categories.module";
import { ConfigModule } from "../../../config/config.module";
import { DatabaseModule } from "../../../database/database.module";
import { CATEGORIES_PROVIDERS } from '../../categories.providers';
import { NotFoundError, SortDirection } from '@fm/micro-videos/@seedwork/domain';
import { Category } from "@fm/micro-videos/category/domain";
import { CategoryCollectionPresenter, CategoryPresenter } from "../../../categories/presenter/category.presenter";
import { CategoryFixture } from "../../../categories/fixtures";

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
    const arrange = CategoryFixture.arrangeForSave();
    test.each(arrange)('with request $request', async ({ send_data, expected }) => {
      const presenter = await controller.create(send_data);
      const entity = await repository.findById(presenter.id);

      expect(presenter.id).toBe(entity.id);
      expect(entity.toJSON()).toStrictEqual({
        id: presenter.id,
        created_at: presenter.created_at,
        ...expected,
        ...send_data,
      });
      expect(presenter).toEqual(new CategoryPresenter(entity));
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

  describe("search method", () => {
    it('should returns categories using query empty ordered by created_at', async () => {
      const categories = Category.fake()
        .theCategories(4)
        .withName((index) => index + '')
        .withCreatedAt((index) => new Date(new Date().getTime() + index))
        .build();

      await repository.bulkInsert(categories);

      const arrange = [
        {
          send_data: {},
          expected: {
            items: [
              categories[3],
              categories[2],
              categories[1],
              categories[0],
            ],
            current_page: 1,
            last_page: 1,
            per_page: 15,
            total: 4,
          }
        },
        {
          send_data: { per_page: 2 },
          expected: {
            items: [
              categories[3],
              categories[2],
            ],
            current_page: 1,
            last_page: 2,
            per_page: 2,
            total: 4,
          }
        },
        {
          send_data: { per_page: 2, page: 2 },
          expected: {
            items: [
              categories[1],
              categories[0],
            ],
            current_page: 2,
            last_page: 2,
            per_page: 2,
            total: 4,
          }
        }
      ];

      for (const item of arrange) {
        const presenter = await controller.search(item.send_data);
        expect(presenter).toEqual(
          new CategoryCollectionPresenter(item.expected)
        );
      }
    });

    it("should returns output using pagination, sort and filter", async () => {
      const faker = Category.fake().aCategory();
      const categories = [
        faker.withName('a').build(),
        faker.withName('AAA').build(),
        faker.withName('AaA').build(),
        faker.withName('b').build(),
        faker.withName('c').build(),
      ];

      await repository.bulkInsert(categories);

      const arrange = [
        {
          send_data: {
            page: 1,
            per_page: 2,
            sort: 'name',
            filter: 'a',
          },
          expected: {
            items: [
              categories[1],
              categories[2],
            ],
            current_page: 1,
            last_page: 2,
            per_page: 2,
            total: 3,
          } as unknown as ListCategoriesUseCase.Output
        },
        {
          send_data: {
            page: 2,
            per_page: 2,
            sort: 'name',
            filter: 'a',
          },
          expected: {
            items: [
              categories[0],
            ],
            current_page: 2,
            last_page: 2,
            per_page: 2,
            total: 3,
          } as unknown as ListCategoriesUseCase.Output
        }
      ];

      for (const item of arrange) {
        const presenter = await controller.search(item.send_data);
        expect(presenter).toEqual(
          new CategoryCollectionPresenter(item.expected)
        );
      }

      const arrange_desc = [
        {
          send_data: {
            page: 1,
            per_page: 2,
            sort: 'name',
            sort_dir: 'desc' as SortDirection,
            filter: 'a',
          },
          expected: {
            items: [
              categories[0],
              categories[2],
            ],
            current_page: 1,
            last_page: 2,
            per_page: 2,
            total: 3,
          } as unknown as ListCategoriesUseCase.Output
        },
        {
          send_data: {
            page: 2,
            per_page: 2,
            sort: 'name',
            sort_dir: 'desc' as SortDirection,
            filter: 'a',
          },
          expected: {
            items: [
              categories[1],
            ],
            current_page: 2,
            last_page: 2,
            per_page: 2,
            total: 3,
          } as unknown as ListCategoriesUseCase.Output
        }
      ];

      for (const item of arrange_desc) {
        const presenter = await controller.search(item.send_data);
        expect(presenter).toEqual(
          new CategoryCollectionPresenter(item.expected)
        );
      }
    });
  });
});