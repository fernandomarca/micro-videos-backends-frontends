import request from 'supertest';
import { CategoryRepository } from '@fm/micro-videos/category/domain';
import { CATEGORIES_PROVIDERS } from '../../../nestjs/src/categories/categories.providers';
import { CreateCategoryFixture } from '../../../nestjs/src/categories/fixtures';
import { CategoriesController } from '../../src/categories/categories.controller';
import { instanceToPlain } from 'class-transformer';
import { getConnectionToken } from '@nestjs/sequelize';
import { startApp } from '../../src/@share/testing/helpers';
describe('CategoriesController (e2e)', () => {
  describe('/categories (POST)', () => {
    describe('should a response error with 422 when request body is invalid', () => {
      const app = startApp();
      const invalidRequest = CreateCategoryFixture.arrangeInvalidRequest();

      const arrange = Object.keys(invalidRequest).map((key) => ({
        label: key,
        value: invalidRequest[key],
      }));
      test.each(arrange)('when body is $label', ({ value }) => {
        return request(app.app.getHttpServer())
          .post('/categories')
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
      const invalidRequest = CreateCategoryFixture.arrangeForEntityValidationError();

      const arrange = Object.keys(invalidRequest).map((key) => ({
        label: key,
        value: invalidRequest[key],
      }));
      test.each(arrange)('when body is $label', ({ value }) => {
        return request(app.app.getHttpServer())
          .post('/categories')
          .send(value.send_data)
          .expect(422)
          .expect(value.expected)
      });
    });
    describe('should create a category', () => {
      const app = startApp();
      const arrange = CreateCategoryFixture.arrangeForSave();
      let categoryRepo: CategoryRepository.Repository;
      beforeEach(async () => {
        categoryRepo = app.app.get<CategoryRepository.Repository>(CATEGORIES_PROVIDERS.REPOSITORIES.CATEGORY_REPOSITORY.provide);
        const sequelize = app.app.get(getConnectionToken());
        await sequelize.sync({ force: true });
      });
      test.each(arrange)('when body is $send_data', async ({ send_data, expected }) => {

        const res = await request(app.app.getHttpServer())
          .post('/categories')
          .send(send_data)
          .expect(201);

        const keyInResponse = CreateCategoryFixture.keysInResponse();
        expect(Object.keys(res.body)).toStrictEqual(['data']);

        expect(Object.keys(res.body.data)).toStrictEqual(keyInResponse);

        const categoryCreated = await categoryRepo.findById(res.body.data.id);

        const presenter = CategoriesController.categoryToResponse(categoryCreated.toJSON());

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
