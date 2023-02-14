import { UniqueEntityId } from "#seedwork/domain";
import { Chance } from "chance";
import { CategoryFakeBuilder } from "../category-fake-builder";

describe('CategoryFakeBuilder unit tests', () => {

  describe("unique_entity_id prop", () => {
    const faker = CategoryFakeBuilder.aCategory();

    it("should throw error when any with methods has called", () => {
      expect(() => faker["getValue"]("unique_entity_id")).toThrow(
        new Error(
          "Property unique_entity_id not have a factory, use 'with' methods"
        )
      );
    });

    it("should be undefined", () => {
      expect(faker["_unique_entity_id"]).toBeUndefined();
    });

    test("withUniqueEntityId", () => {
      const uniqueEntityId = new UniqueEntityId();
      const $this = faker.withUniqueEntityId(uniqueEntityId);
      expect($this).toBeInstanceOf(CategoryFakeBuilder);
      expect(faker["_unique_entity_id"]).toBe(uniqueEntityId);

      faker.withUniqueEntityId(() => uniqueEntityId);
      expect(faker["_unique_entity_id"]()).toBe(uniqueEntityId);

      expect(faker["unique_entity_id"]).toBe(uniqueEntityId);
    });

    it("should pass index to unique_entity_id factory", () => {
      let mockFactory = jest.fn().mockReturnValue(new UniqueEntityId());
      faker.withUniqueEntityId(mockFactory);
      faker.build();
      expect(mockFactory).toHaveBeenCalledWith(0);

      mockFactory = jest.fn().mockReturnValue(new UniqueEntityId());
      const fakerMany = CategoryFakeBuilder.theCategories(2);
      fakerMany.withUniqueEntityId(mockFactory);
      fakerMany.build();

      expect(mockFactory).toHaveBeenCalledWith(0);
      expect(mockFactory).toHaveBeenCalledWith(1);
    });
  });

  describe('name prop', () => {
    const faker = CategoryFakeBuilder.aCategory();

    it('should be a function', () => {
      expect(typeof faker['_name'] === 'function').toBeTruthy();
    });

    it('should call the word method', () => {
      const chance = Chance();
      const spyWordMethod = jest.spyOn(chance, 'word');
      faker['chance'] = chance;
      faker.build();
      expect(spyWordMethod).toHaveBeenCalled();
    });

    test('withName', () => {
      const $this = faker.withName('test name');
      expect($this).toBeInstanceOf(CategoryFakeBuilder);
      expect(faker['name']).toBe("test name");

      faker.withName(() => 'test name');
      //@ts-expect-error
      expect(faker['_name']()).toBe("test name");
    })
    it('should pass index to name factory', () => {
      faker.withName((index) => `test name ${index}`);
      const category = faker.build();
      expect(category.name).toBe("test name 0");

      const fakerMany = CategoryFakeBuilder.theCategories(2);
      fakerMany.withName((index) => `test name ${index}`);
      const categories = fakerMany.build();

      expect(categories[0].name).toBe("test name 0");
      expect(categories[1].name).toBe("test name 1");
    });

    test("invalid empty case", () => {
      faker.withInvalidNameEmpty(undefined);
      expect(faker["name"]).toBeUndefined();

      faker.withInvalidNameEmpty(null);
      expect(faker["name"]).toBeNull();

      faker.withInvalidNameEmpty("");
      expect(faker["name"]).toBe("");
    });

    test("invalid too long case", () => {
      faker.withInvalidNameTooLong();
      expect(faker["name"].length).toBe(256);

      const tooLong = "a".repeat(256);
      faker.withInvalidNameTooLong(tooLong);
      expect(faker["name"].length).toBe(256);
      expect(faker["name"]).toBe(tooLong);

    });
  });
});

describe("is_active prop", () => {
  const faker = CategoryFakeBuilder.aCategory();

  it("should be a function", () => {
    expect(typeof faker["_is_active"] === "function").toBeTruthy();
  });

  it("activate", () => {
    faker.activate();
    expect(faker["_is_active"]).toBeTruthy();
  });

  it("deactivate", () => {
    faker.deactivate();
    expect(faker["_is_active"]).toBeFalsy();
  });

  describe("created_at prop", () => {
    const faker = CategoryFakeBuilder.aCategory();

    it("should throw error when any with methods has called", () => {
      const fakerCategory = CategoryFakeBuilder.aCategory();
      expect(() => fakerCategory["created_at"]).toThrow(
        new Error("Property created_at not have a factory, use 'with' methods")
      );
    });

    it("should be undefined", () => {
      expect(faker["_created_at"]).toBeUndefined();
    });

    test("withCreatedAt", () => {
      const date = new Date();
      const $this = faker.withCreatedAt(date);
      expect($this).toBeInstanceOf(CategoryFakeBuilder);
      expect(faker["_created_at"]).toBe(date);

      faker.withCreatedAt(() => date);
      expect(faker["_created_at"]()).toBe(date);
      expect(faker["created_at"]).toBe(date);
    });

    it("should pass index to created_at factory", () => {
      const date = new Date();
      faker.withCreatedAt((index) => new Date(date.getTime() + index + 2));
      const category = faker.build();
      expect(category.created_at.getTime()).toBe(date.getTime() + 2);

      const fakerMany = CategoryFakeBuilder.theCategories(2);
      fakerMany.withCreatedAt((index) => new Date(date.getTime() + index + 2));
      const categories = fakerMany.build();

      expect(categories[0].created_at.getTime()).toBe(date.getTime() + 0 + 2);
      expect(categories[1].created_at.getTime()).toBe(date.getTime() + 1 + 2);
    });
  });

  it("should create a category", () => {
    const faker = CategoryFakeBuilder.aCategory();
    let category = faker.build();

    expect(category.uniqueEntityId).toBeInstanceOf(UniqueEntityId);
    expect(typeof category.name === "string").toBeTruthy();
    expect(typeof category.description === "string").toBeTruthy();
    expect(category.is_active).toBeTruthy();
    expect(category.created_at).toBeInstanceOf(Date);

    const created_at = new Date();
    const uniqueEntityId = new UniqueEntityId();
    category = faker.withUniqueEntityId(uniqueEntityId)
      .withName('name test')
      .withDescription('description test')
      .deactivate()
      .withCreatedAt(created_at)
      .build();
    expect(category.uniqueEntityId.value).toBe(uniqueEntityId.value);
    expect(category.name).toBe('name test');
    expect(category.description).toBe('description test');
    expect(category.is_active).toBeFalsy();
    expect(category.props.created_at).toEqual(created_at);

  });

  it("should create many categories", () => {
    const faker = CategoryFakeBuilder.theCategories(2);
    let categories = faker.build();

    categories.forEach((category) => {
      expect(category.uniqueEntityId).toBeInstanceOf(UniqueEntityId);
      expect(typeof category.name === "string").toBeTruthy();
      expect(typeof category.description === "string").toBeTruthy();
      expect(category.is_active).toBeTruthy();
      expect(category.created_at).toBeInstanceOf(Date);
    });

    const created_at = new Date();
    const uniqueEntityId = new UniqueEntityId();
    categories = faker
      .withUniqueEntityId(uniqueEntityId)
      .withName('name test')
      .withDescription('description test')
      .deactivate()
      .withCreatedAt(created_at)
      .build();
    categories.forEach((category) => {
      expect(category.uniqueEntityId.value).toBe(uniqueEntityId.value);
      expect(category.name).toBe('name test');
      expect(category.description).toBe('description test');
      expect(category.is_active).toBeFalsy();
      expect(category.props.created_at).toEqual(created_at);
    });

  });
});