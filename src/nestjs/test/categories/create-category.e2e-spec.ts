import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../../nestjs/src/app.module';
import { CategoryRepository } from '@fm/micro-videos/category/domain';
import { CATEGORIES_PROVIDERS } from '../../../nestjs/src/categories/categories.providers';
import { CategoryFixture } from '../../../nestjs/src/categories/fixtures';
import { CategoriesController } from '../../src/categories/categories.controller';
import { instanceToPlain } from 'class-transformer';
import { applyGlobalConfig } from '../../src/global-config';

function startApp({ beforeInit }: { beforeInit?: (app: INestApplication) => void } = {}) {
  let _app: INestApplication;
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    _app = moduleFixture.createNestApplication();
    applyGlobalConfig(_app);
    beforeInit && beforeInit(_app);
    await _app.init();
  });
  return {
    get app() {
      return _app;
    }
  }
}
describe('CategoriesController (e2e)', () => {
  let app: INestApplication;
  let categoryRepo: CategoryRepository.Repository;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    categoryRepo = moduleFixture.get<CategoryRepository.Repository>(CATEGORIES_PROVIDERS.REPOSITORIES.CATEGORY_REPOSITORY.provide);

    app = moduleFixture.createNestApplication();
    applyGlobalConfig(app);
    await app.init();
  });

  describe('POST /categories', () => {

    describe('should a response error with 422 when request body is invalid', () => {
      const app = startApp();
      const invalidRequest = CategoryFixture.arrangeInvalidRequest();

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
      const invalidRequest = CategoryFixture.arrangeForEntityValidationError();

      const arrange = Object.keys(invalidRequest).map((key) => ({
        label: key,
        value: invalidRequest[key],
      }));
      test.each(arrange)('when body is $label', async ({ value }) => {
        const res = await request(app.app.getHttpServer())
          .post('/categories')
          .send(value.send_data)
          .expect(422)
          .expect(value.expected)
      });
    });
    describe('should create a category', () => {
      const app = startApp();
      const arrange = CategoryFixture.arrangeForSave();
      beforeEach(async () => {
        categoryRepo = app.app.get<CategoryRepository.Repository>(CATEGORIES_PROVIDERS.REPOSITORIES.CATEGORY_REPOSITORY.provide);
      });
      test.each(arrange)('when body is $send_data', async ({ send_data, expected }) => {

        const res = await request(app.app.getHttpServer())
          .post('/categories')
          .send(send_data)
          .expect(201);

        const keyInResponse = CategoryFixture.keysInCategoryResponse();
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
