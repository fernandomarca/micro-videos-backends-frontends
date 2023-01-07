import { Category } from "@fm/micro-videos/category/domain";

export class CategoryFixture {
  static keysInCategoryResponse() {
    return [
      'id',
      'name',
      'description',
      'is_active',
      'created_at',
    ]
  }

  static arrangeForSave() {
    const faker = Category.fake().aCategory().withName('Movie').build();
    return [
      {
        send_data: {
          name: faker.name
        },
        expected: {
          description: null,
          is_active: true,
        }
      },
      {
        send_data: {
          name: faker.name,
          description: null,
        },
        expected: {
          is_active: true
        }
      },
      {
        send_data: {
          name: faker.name,
          is_active: true
        },
        expected: {
          description: null,
        }
      }
    ];
  }
}