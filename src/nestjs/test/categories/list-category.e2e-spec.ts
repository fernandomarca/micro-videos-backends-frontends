import request from 'supertest';
import { Category, CategoryRepository } from '@fm/micro-videos/category/domain';
import { CATEGORIES_PROVIDERS } from '../../src/categories/categories.providers';
import { ListCategoriesFixture, UpdateCategoryFixture } from '../../src/categories/fixtures';
import { CategoriesController } from '../../src/categories/categories.controller';
import { instanceToPlain } from 'class-transformer';
import { getConnectionToken } from '@nestjs/sequelize';
import { startApp } from '../../src/@share/testing/helpers';

describe('CategoriesController (e2e)', () => {
  // const uuid = '93366b7dc-2d71-4799-b91c-c64adb205104';
  describe('/categories (GET)', () => {

    describe('should return categories sorted by created_at when request query is empty', () => {

      let categoryRepo: CategoryRepository.Repository;
      const nestApp = startApp();
      const { entities: entitiesMap, arrange } = ListCategoriesFixture.arrangeIncrementedWithCreatedAt();

      beforeEach(async () => {
        categoryRepo = nestApp.app.get<CategoryRepository.Repository>(
          CATEGORIES_PROVIDERS.REPOSITORIES.CATEGORY_REPOSITORY.provide
        );
        await categoryRepo.bulkInsert(Object.values(entitiesMap));
      });
      test.each(arrange)('when query params is $send_data', async ({ send_data, expected }) => {
        //page=1&per_page=2
        const queryParams = new URLSearchParams(send_data as any).toString();
        return request(nestApp.app.getHttpServer())
          .get(`/categories/?${queryParams}`)
          .send(send_data)
          .expect(200)
          .expect({
            data: expected.entities.map((e) =>
              instanceToPlain(CategoriesController.categoryToResponse(e))),
            meta: expected.meta
          })
      });
    });

    describe('should return categories using paginate, filter, and sort', () => {

      let categoryRepo: CategoryRepository.Repository;
      const nestApp = startApp();
      const { entities: entitiesMap, arrange } = ListCategoriesFixture.arrangeUnsorted();

      beforeEach(async () => {
        categoryRepo = nestApp.app.get<CategoryRepository.Repository>(
          CATEGORIES_PROVIDERS.REPOSITORIES.CATEGORY_REPOSITORY.provide
        );
        await categoryRepo.bulkInsert(Object.values(entitiesMap));
      });
      test.each(arrange)('when query params is $send_data', async ({ send_data, expected }) => {
        //page=1&per_page=2
        const queryParams = new URLSearchParams(send_data as any).toString();
        return request(nestApp.app.getHttpServer())
          .get(`/categories/?${queryParams}`)
          .send(send_data)
          .expect(200)
          .expect({
            data: expected.entities.map((e) =>
              instanceToPlain(CategoriesController.categoryToResponse(e))),
            meta: expected.meta
          })
      });
    });
  });
});
