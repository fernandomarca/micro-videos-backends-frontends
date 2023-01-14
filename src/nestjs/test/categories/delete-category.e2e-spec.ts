import request from 'supertest';
import { Category, CategoryRepository } from '@fm/micro-videos/category/domain';
import { CATEGORIES_PROVIDERS } from '../../src/categories/categories.providers';
import { UpdateCategoryFixture } from '../../src/categories/fixtures';
import { CategoriesController } from '../../src/categories/categories.controller';
import { instanceToPlain } from 'class-transformer';
import { getConnectionToken } from '@nestjs/sequelize';
import { startApp } from '../../src/@share/testing/helpers';
import { NotFoundError } from 'rxjs';

describe('CategoriesController (e2e)', () => {
  describe('/delete/:id (DELETE)', () => {

    const nestApp = startApp();
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

      test.each(arrange)('when id is $id', async ({ id, send_data, expected }) => {
        return request(nestApp.app.getHttpServer())
          .put(`/categories/${id}`)
          .send(send_data)
          .expect(expected.status)
          .expect(expected)
      });
    });

    it('should delete a category response with status 204', async () => {
      const categoryRepo = nestApp.app.get<CategoryRepository.Repository>(CATEGORIES_PROVIDERS.REPOSITORIES.CATEGORY_REPOSITORY.provide);
      const category = Category.fake().aCategory().build();
      await categoryRepo.insert(category);

      await request(nestApp.app.getHttpServer())
        .put(`/categories/${category.id}`)
        .expect(204);

      await expect(categoryRepo.findById(category.id)).rejects.toThrow(
        new NotFoundError(`Entity Not Found using ID ${category.id}`)
      )
    });
  });
});