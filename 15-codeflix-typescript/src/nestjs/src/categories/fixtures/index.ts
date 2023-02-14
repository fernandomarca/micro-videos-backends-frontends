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
    const faker = Category.fake().aCategory()
      .withName('Movie')
      .withDescription('description test')
      .build();
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
      },
      {
        send_data: {
          name: faker.name,
          is_active: false
        },
        expected: {
          description: null,
        }
      },
      {
        send_data: {
          name: faker.name,
          description: faker.description,
          is_active: true
        },
        expected: {}
      }
    ];
  }

  static arrangeInvalidRequest() {
    const faker = Category.fake().aCategory();

    const defaultExpected = {
      statusCode: 422,
      error: 'Unprocessable Entity'
    }

    return {
      EMPTY: {
        send_data: {},
        expected: {
          message: ['name should not be empty', 'name must be a string',
          ],
          ...defaultExpected
        }
      },
      NAME_UNDEFINED: {
        send_data: {
          name: faker.withInvalidNameEmpty(undefined).name
        },
        expected: {
          message: ['name should not be empty', 'name must be a string',
          ],
          ...defaultExpected
        }
      },
      NAME_NULL: {
        send_data: {
          name: faker.withInvalidNameEmpty(null).name
        },
        expected: {
          message: ['name should not be empty', 'name must be a string',
          ],
          ...defaultExpected
        }
      },
      NAME_EMPTY: {
        send_data: {
          name: faker.withInvalidNameEmpty('').name
        },
        expected: {
          message: [
            'name should not be empty',
          ],
          ...defaultExpected
        }
      },
      DESCRIPTION_NOT_A_STRING: {
        send_data: {
          description: faker.withInvalidDescriptionNotString().description
        },
        expected: {
          message: [
            'name should not be empty',
            'name must be a string',
            'description must be a string'
          ],
          ...defaultExpected
        }
      },
      IS_ACTIVE_NOT_A_BOOLEAN: {
        send_data: {
          is_active: faker.withInvalidActiveNotBoolean().is_active
        },
        expected: {
          message: [
            'name should not be empty',
            'name must be a string',
            'is_active must be a boolean value'
          ],
          ...defaultExpected
        }
      }
    }
  }

  static arrangeForEntityValidationError() {
    const faker = Category.fake().aCategory();

    const defaultExpected = {
      statusCode: 422,
      error: 'Unprocessable Entity'
    }

    return {
      EMPTY: {
        send_data: {},
        expected: {
          message: [
            'name should not be empty',
            'name must be a string',
            'name must be shorter than or equal to 255 characters'
          ],
          ...defaultExpected
        }
      },
      NAME_UNDEFINED: {
        send_data: {
          name: faker.withInvalidNameEmpty(undefined).name
        },
        expected: {
          message: [
            'name should not be empty',
            'name must be a string',
            'name must be shorter than or equal to 255 characters'
          ],
          ...defaultExpected
        }
      },
      NAME_NULL: {
        send_data: {
          name: faker.withInvalidNameEmpty(null).name
        },
        expected: {
          message: [
            'name should not be empty',
            'name must be a string',
            'name must be shorter than or equal to 255 characters'
          ],
          ...defaultExpected
        }
      },
      NAME_EMPTY: {
        send_data: {
          name: faker.withInvalidNameEmpty('').name
        },
        expected: {
          message: [
            'name should not be empty',
          ],
          ...defaultExpected
        }
      },
      DESCRIPTION_NOT_A_STRING: {
        send_data: {
          description: faker.withInvalidDescriptionNotString().description
        },
        expected: {
          message: [
            'name should not be empty',
            'name must be a string',
            'name must be shorter than or equal to 255 characters',
            'description must be a string'
          ],
          ...defaultExpected
        }
      },
      IS_ACTIVE_NOT_A_BOOLEAN: {
        send_data: {
          is_active: faker.withInvalidActiveNotBoolean().is_active
        },
        expected: {
          message: [
            'name should not be empty',
            'name must be a string',
            'name must be shorter than or equal to 255 characters',
            'is_active must be a boolean value'
          ],
          ...defaultExpected
        }
      }
    }
  }
}

export class CreateCategoryFixture {
  static keysInResponse() {
    return CategoryFixture.keysInCategoryResponse();
  }
  static arrangeForSave() {
    return CategoryFixture.arrangeForSave();
  }
  static arrangeInvalidRequest() {
    return CategoryFixture.arrangeInvalidRequest();
  }
  static arrangeForEntityValidationError() {
    return CategoryFixture.arrangeForEntityValidationError();
  }
}

export class UpdateCategoryFixture {
  static keysInResponse() {
    return CategoryFixture.keysInCategoryResponse();
  }
  static arrangeForSave() {
    return CategoryFixture.arrangeForSave();
  }
  static arrangeInvalidRequest() {
    return CategoryFixture.arrangeInvalidRequest();
  }
  static arrangeForEntityValidationError() {
    const { IS_ACTIVE_NOT_A_BOOLEAN, ...otherKeys } = CategoryFixture.arrangeForEntityValidationError();
    return otherKeys;
  }
}

export class ListCategoriesFixture {
  static arrangeIncrementedWithCreatedAt() {
    const _entities = Category.fake()
      .theCategories(4)
      .withName((i) => i + '')
      .withCreatedAt((i) => new Date(new Date().getTime() + i * 2000))
      .build();

    const entities = {
      first: _entities[0],
      second: _entities[1],
      third: _entities[2],
      fourth: _entities[3],
    };

    const arrange = [
      {
        send_data: {},
        expected: {
          entities: [
            entities.fourth,
            entities.third,
            entities.second,
            entities.first,
          ],
          meta: {
            current_page: 1,
            last_page: 1,
            per_page: 15,
            total: 4,
          },
        },
      },
      {
        send_data: {
          page: 1,
          per_page: 2,
        },
        expected: {
          entities: [entities.fourth, entities.third],
          meta: {
            current_page: 1,
            last_page: 2,
            per_page: 2,
            total: 4,
          },
        },
      },
      {
        send_data: {
          page: 2,
          per_page: 2,
        },
        expected: {
          entities: [entities.second, entities.first],
          meta: {
            current_page: 2,
            last_page: 2,
            per_page: 2,
            total: 4,
          },
        },
      },
    ];

    return { arrange, entities };
  }

  static arrangeUnsorted() {
    const faker = Category.fake().aCategory();

    const entities = {
      a: faker.withName('a').build(),
      AAA: faker.withName('AAA').build(),
      AaA: faker.withName('AaA').build(),
      b: faker.withName('b').build(),
      c: faker.withName('c').build(),
    };

    const arrange = [
      {
        send_data: {
          page: 1,
          per_page: 2,
          sort: 'name',
          filter: 'a'
        },
        expected: {
          entities: [
            entities.AAA,
            entities.AaA,
          ],
          meta: {
            current_page: 1,
            last_page: 2,
            per_page: 2,
            total: 3
          }
        }
      },
      {
        send_data: {
          page: 2,
          per_page: 2,
          sort: 'name',
          filter: 'a'
        },
        expected: {
          entities: [
            entities.a,
          ],
          meta: {
            current_page: 2,
            last_page: 2,
            per_page: 2,
            total: 3
          }
        }
      },
    ];
    return { arrange, entities };
  }

}