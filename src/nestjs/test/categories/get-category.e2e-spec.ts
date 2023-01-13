import request from 'supertest';
import { Category, CategoryRepository } from '@fm/micro-videos/category/domain';
import { CATEGORIES_PROVIDERS } from '../../src/categories/categories.providers';
import { CategoryFixture, UpdateCategoryFixture } from '../../src/categories/fixtures';
import { CategoriesController } from '../../src/categories/categories.controller';
import { instanceToPlain } from 'class-transformer';
import { getConnectionToken } from '@nestjs/sequelize';
import { startApp } from '../../src/@share/testing/helpers';

describe('CategoriesController (e2e)', () => {
  const nestApp = startApp();
  describe('/categories/:id (GET)', () => {

    describe('should a response error when id is invalid or not found', () => {
      const arrange = [
        {
          id: '88ff2587-ce5a-4769-a8c6-1d63d29c5f7a',
          expected: {
            message: "Entity Not Found using ID 88ff2587-ce5a-4769-a8c6-1d63d29c5f7a",
            status: 404,
            error: 'Not Found'
          }
        },
        {
          id: 'fake id',
          expected: {
            status: 422,
            message: "Validation failed (uuid is expected)",
            error: 'Unprocessable Entity'
          }
        }
      ];

      test.each(arrange)('when id is $id', async ({ id, expected }) => {
        return request(nestApp.app.getHttpServer())
          .get(`/categories/${id}`)
          .expect(expected.status)
          .expect(expected)
      });
    });

    it('should return a category', async () => {
      const categoryRepo = nestApp.app.get<CategoryRepository.Repository>(CATEGORIES_PROVIDERS.REPOSITORIES.CATEGORY_REPOSITORY.provide);
      const category = Category.fake().aCategory().build();
      categoryRepo.insert(category);

      const res = await request(nestApp.app.getHttpServer())
        .put(`/categories/${category.id}`)
        .expect(200);

      const keyInResponse = CategoryFixture.keysInCategoryResponse();
      expect(Object.keys(res.body)).toStrictEqual(['data']);

      expect(Object.keys(res.body.data)).toStrictEqual(keyInResponse);

      const presenter = CategoriesController.categoryToResponse(category.toJson());

      const serialized = instanceToPlain(presenter);

      expect(res.body.data).toStrictEqual(serialized);
    });
  });
});
