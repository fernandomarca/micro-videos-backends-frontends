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
import { CategoryFixture, ListCategoriesFixture, UpdateCategoryFixture } from "../../../categories/fixtures";

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
    const arrange = UpdateCategoryFixture.arrangeForSave();
    const category = Category.fake().aCategory().build();
    beforeEach(async () => {
      await repository.insert(category);
    });
    test.each(arrange)('with request $send_data', async ({ send_data, expected }) => {
      const presenter = await controller.update(category.id, send_data);
      const entity = await repository.findById(presenter.id);

      expect(entity).toMatchObject({
        id: presenter.id,
        created_at: presenter.created_at,
        ...send_data,
        ...expected
      });
      expect(presenter).toEqual(new CategoryPresenter(entity));
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
    describe('should returns categories using query empty ordered by created_at', () => {
      const { entities: entitiesObj, arrange } = ListCategoriesFixture.arrangeIncrementedWithCreatedAt();

      beforeEach(async () => {
        await repository.bulkInsert(Object.values(entitiesObj));
      });
      test.each(arrange)('when send_data is $send_data', async ({
        send_data, expected
      }) => {
        const presenter = await controller.search(send_data);
        const { entities, ...paginationProps } = expected;
        expect(presenter).toEqual(
          new CategoryCollectionPresenter({
            items: entities,
            ...paginationProps.meta
          }));
      });
    });

    describe("should returns output using pagination, sort and filter", () => {
      const { entities: entitiesObj, arrange } = ListCategoriesFixture.arrangeUnsorted();

      beforeEach(async () => {
        await repository.bulkInsert(Object.values(entitiesObj));
      });

      test.each(arrange)('when send_data is $send_data', async ({
        send_data, expected
      }) => {
        const presenter = await controller.search(send_data);
        const { entities, ...paginationProps } = expected;
        expect(presenter).toEqual(
          new CategoryCollectionPresenter({
            items: entities,
            ...paginationProps.meta
          }));
      });
    });
  });
});
