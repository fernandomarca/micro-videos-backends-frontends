import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../../nestjs/src/app.module';
import { CategoryRepository } from '@fm/micro-videos/category/domain';
import { CATEGORIES_PROVIDERS } from '../../../nestjs/src/categories/categories.providers';
import { CategoryFixture } from '../../../nestjs/src/categories/fixtures';
import { CategoriesController } from '../../src/categories/categories.controller';
import { instanceToPlain } from 'class-transformer';


describe('CategoriesController (e2e)', () => {
  let app: INestApplication;
  let categoryRepo: CategoryRepository.Repository;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    categoryRepo = moduleFixture.get<CategoryRepository.Repository>(CATEGORIES_PROVIDERS.REPOSITORIES.CATEGORY_REPOSITORY.provide);

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('POST /categories', () => {
    const arrange = CategoryFixture.arrangeForSave();

    describe('should create a category', () => {

      test.each(arrange)('when body is $send_data', async ({ send_data, expected }) => {

        const res = await request(app.getHttpServer())
          .post('/categories')
          .send(send_data)
          .expect(201);

        expect(Object.keys(res.body)).toStrictEqual(CategoryFixture.keysInCategoryResponse());
        const categoryCreated = await categoryRepo.findById(res.body.id);

        const presenter = CategoriesController.categoryToResponse(categoryCreated.toJSON());

        const serialized = instanceToPlain(presenter);

        expect(res.body).toStrictEqual(serialized);
        expect(res.body).toStrictEqual({
          id: serialized.id,
          created_at: serialized.created_at,
          ...send_data,
          ...expected
        });
      });
    });
  });
});
