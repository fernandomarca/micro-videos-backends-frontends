import { ValidationError } from "../../../@seedwork/domain/errors/validation-error";
import { Category } from "./category";

describe('Category Integration Tests', () => {
  describe("Create method", () => {
    it("should be a invalid category using property name", () => {
      expect(() => new Category({ name: null })).toThrow(new ValidationError('The name is required'));

      expect(() => new Category({ name: "" })).toThrow(new ValidationError("The name is required"));

      expect(() => new Category({ name: 5 as any })).toThrow(new ValidationError("The name must be a string"));

      expect(() => new Category({ name: "t".repeat(256) })).toThrow(new ValidationError("The name must be less than 255 characters"));
    });

    it("should be a invalid category using property description", () => {
      //@ts-ignore
      expect(() => new Category({ name: "teste", description: 5 as any })).toThrow(new ValidationError("The description must be a string"));
    });

    it("should be a invalid category using property is_active", () => {
      //@ts-ignore
      expect(() => new Category({ name: "teste", is_active: 5 as any })).toThrow(new ValidationError("The is_active must be a boolean"));
    });

    it("should a valid category", () => {
      expect.assertions(0);
      new Category({ name: "Movie" }); //NOSONAR
      new Category({ name: "Movie", description: "some description" });//NOSONAR
      new Category({ name: "Movie", description: null });//NOSONAR
     /* NOSONAR */ new Category({
        name: "Movie", description: "some description",
        is_active: true
      });
      /* NOSONAR */ new Category({
        name: "Movie", description: "some description",
        is_active: false
      });
    });
  });
  describe("Update method", () => {
    it("should be a invalid category using property name", () => {
      const category = new Category({ name: "Movie" });
      expect(() => category.update(null, null)).toThrow(new ValidationError('The name is required'));

      expect(() => category.update("", null)).toThrow(new ValidationError("The name is required"));

      expect(() => category.update(5 as any, null)).toThrow(new ValidationError("The name must be a string"));

      expect(() => category.update("t".repeat(256), null)).toThrow(new ValidationError("The name must be less than 255 characters"));
    });

    it("should be a invalid category using property description", () => {
      const category = new Category({ name: "Movie" });
      //@ts-ignore
      expect(() => category.update("teste", 5 as any)).toThrow(new ValidationError("The description must be a string"));
    });

    it("should a valid category", () => {
      expect.assertions(0);
      const category = new Category({ name: "Movie" });
      category.update("name changed", null);
      category.update("name changed", "some description");
    });
  });
});