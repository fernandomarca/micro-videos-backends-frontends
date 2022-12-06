import CategoryValidatorFactory, { CategoryRules, CategoryValidator } from "./category.validator";

describe("CategoryValidator Tests", () => {
  let validator: CategoryValidator;
  beforeEach(() => (
    validator = CategoryValidatorFactory.create()
  ));
  test("invalidation cases for name field", () => {
    const arrange = [
      {
        validator, data: null, name: [
          'name should not be empty',
          'name must be a string',
          'name must be shorter than or equal to 255 characters'
        ]
      },
      {
        validator, data: "", name: [
          'name should not be empty',
        ]
      },
      {
        validator, data: { name: 5 as any }, name: [
          'name must be a string',
          'name must be shorter than or equal to 255 characters'
        ]
      },
      {
        validator, data: { name: 't'.repeat(256) }, name: [
          'name must be shorter than or equal to 255 characters'
        ]
      },
    ]
    arrange.forEach((item) => {
      expect(item).containsErrorMessages(item.name);
    });
  });

  test("invalidation cases for description field", () => {
    const arrange = [
      {
        validator, data: { description: 5 }, description: [
          'description must be a string',
        ]
      },]
    arrange.forEach((item) => {
      expect(item).containsErrorMessages(item.description);
    });
  });

  test("invalidation cases for is_active field", () => {
    const arrange = [
      {
        validator, data: { is_active: 5 }, is_active: [
          'is_active must be a boolean value',
        ]
      },
      {
        validator, data: { is_active: 0 }, is_active: [
          'is_active must be a boolean value',
        ]
      },
      {
        validator, data: { is_active: 1 }, is_active: [
          'is_active must be a boolean value',
        ]
      },
    ]
    arrange.forEach((item) => {
      expect(item).containsErrorMessages(item.is_active);
    });
  });

  describe("valid cases for fields", () => {
    type Arrange = {
      name: string;
      description?: string;
      is_active?: boolean;
    }

    const arrange: Arrange[] = [
      { name: "some value" },
      { name: "some value", description: undefined },
      { name: "some value", description: null },
      { name: "some value", is_active: true },
      { name: "some value", is_active: false }
    ];
    test.each(arrange)("validate %o", (item) => {
      let isValid = validator.validate(item);
      expect(isValid).toBeTruthy();
      expect(validator.validatedData).toStrictEqual(new CategoryRules(item));
    });

  });
})