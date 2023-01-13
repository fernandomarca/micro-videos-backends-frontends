import request from 'supertest';
import { Category, CategoryRepository } from '@fm/micro-videos/category/domain';
import { CATEGORIES_PROVIDERS } from '../../src/categories/categories.providers';
import { UpdateCategoryFixture } from '../../src/categories/fixtures';
import { CategoriesController } from '../../src/categories/categories.controller';
import { instanceToPlain } from 'class-transformer';
import { getConnectionToken } from '@nestjs/sequelize';
import { startApp } from '../../src/@share/testing/helpers';

describe('CategoriesController (e2e)', () => {
  const uuid = '93366b7dc-2d71-4799-b91c-c64adb205104';
  describe('/categories/:id (PUT)', () => {

    describe('should a response error when id is invalid or not found', () => {
      const nestApp = startApp();
      const faker = Category.fake().aCategory();
      const arrange = [
        {
          id: '88ff2587-ce5a-4769-a8c6-1d63d29c5f7a',
          send_data: { name: faker.name },
          expected: {
            message: "Entity Not Found using ID 88ff2587-ce5a-4769-a8c6-1d63d29c5f7a",
            status: 404,
            error: 'Not Found'
          }
        },
        {
          id: 'fake id',
          send_data: { name: faker.name },
          expected: {
            status: 422,
            message: "Validation failed (uuid is expected)",
            error: 'Unprocessable Entity'
          }
        }
      ];

      test.each(arrange)('when id is $id', async ({ id, send_data, expected }) => {
        return request(nestApp.app.getHttpServer())
          .put(`/categories/${id}`)
          .send(send_data)
          .expect(expected.status)
          .expect(expected)
      });
    });

    describe('should a response error with 422 when request body is invalid', () => {
      const app = startApp();
      const invalidRequest = UpdateCategoryFixture.arrangeInvalidRequest();

      const arrange = Object.keys(invalidRequest).map((key) => ({
        label: key,
        value: invalidRequest[key],
      }));
      test.each(arrange)('when body is $label', ({ value }) => {
        return request(app.app.getHttpServer())
          .put(`/categories/${uuid}`)
          .send(value.send_data)
          .expect(422)
          .expect(value.expected)
      });
    });

    describe('should a response error with 422 when throw EntityValidationError', () => {
      const app = startApp({
        beforeInit: (app) => {
          app['config'].globalPipes = [];
        }
      });

      const invalidRequest = UpdateCategoryFixture.arrangeForEntityValidationError();

      const arrange = Object.keys(invalidRequest).map((key) => ({
        label: key,
        value: invalidRequest[key],
      }));
      let categoryRepo: CategoryRepository.Repository;
      beforeEach(async () => {
        categoryRepo = app.app.get<CategoryRepository.Repository>(CATEGORIES_PROVIDERS.REPOSITORIES.CATEGORY_REPOSITORY.provide);
      });
      test.each(arrange)('when body is $label', async ({ value }) => {
        const category = Category.fake().aCategory().build();
        await categoryRepo.insert(category);
        return request(app.app.getHttpServer())
          .put(`/categories/${category.id}`)
          .send(value.send_data)
          .expect(422)
          .expect(value.expected)
      });
    });
    describe('should update a category', () => {
      const app = startApp();
      const arrange = UpdateCategoryFixture.arrangeForSave();
      let categoryRepo: CategoryRepository.Repository;

      beforeEach(async () => {
        categoryRepo = app.app.get<CategoryRepository.Repository>(CATEGORIES_PROVIDERS.REPOSITORIES.CATEGORY_REPOSITORY.provide);
        const sequelize = app.app.get(getConnectionToken());
        await sequelize.sync({ force: true });
      });
      test.each(arrange)('when body is $send_data', async ({ send_data, expected }) => {
        const categoryCreated = Category.fake().aCategory().build();
        await categoryRepo.insert(categoryCreated);
        const res = await request(app.app.getHttpServer())
          .put(`/categories/${categoryCreated.id}`)
          .send(send_data)
          .expect(200);

        const keyInResponse = UpdateCategoryFixture.keysInResponse();
        expect(Object.keys(res.body)).toStrictEqual(['data']);

        expect(Object.keys(res.body.data)).toStrictEqual(keyInResponse);

        const categoryUpdated = await categoryRepo.findById(res.body.data.id);

        const presenter = CategoriesController.categoryToResponse(categoryUpdated.toJSON());

        const serialized = instanceToPlain(presenter);

        expect(res.body.data).toStrictEqual(serialized);
        expect(res.body.data).toStrictEqual({
          id: serialized.id,
          created_at: serialized.created_at,
          ...send_data,
          ...expected
        });
      });
    });
  });
});
