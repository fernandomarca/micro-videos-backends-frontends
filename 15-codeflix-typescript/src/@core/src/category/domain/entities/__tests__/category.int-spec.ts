import { Category } from "../category";

describe('Category Integration Tests', () => {
  describe("Create method", () => {
    it("should be a invalid category using property name", () => {
      const arrange = [
        {
          name: null,
          messages: [
            'name should not be empty',
            'name must be a string',
            'name must be shorter than or equal to 255 characters'
          ]
        },
        {
          name: "",
          messages: [
            "The name is required"
          ]
        },
        {
          name: { name: 5 as any },
          messages: [
            "The name must be a string"
          ]
        },
        {
          name: { name: "t".repeat(256) },
          messages: [
            "The name must be less than 255 characters"
          ]
        },
      ];

      arrange.forEach((item) => {
        //@ts-ignore
        expect(() => new Category(item.name)).containsErrorMessages({ name: item.messages });
      });
    });

    it("should be a invalid category using property description", () => {
      //@ts-ignore
      expect(() => new Category({ name: "teste", description: 5 as any })).containsErrorMessages({ description: ["The description must be a string"] });
    });

    it("should be a invalid category using property is_active", () => {
      //@ts-ignore
      expect(() => new Category({ name: "teste", is_active: 5 as any })).containsErrorMessages({ is_active: ["The is_active must be a boolean"] });
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
      expect(() => category.update(null, null)).containsErrorMessages({ name: ['The name is required'] });

      expect(() => category.update("", null)).containsErrorMessages({ name: ["The name is required"] });

      expect(() => category.update(5 as any, null)).containsErrorMessages({ name: ["The name must be a string"] });

      expect(() => category.update("t".repeat(256), null)).containsErrorMessages({ name: ["The name must be less than 255 characters"] });
    });

    it("should be a invalid category using property description", () => {
      const category = new Category({ name: "Movie" });
      //@ts-ignore
      expect(() => category.update("teste", 5 as any)).containsErrorMessages({ description: ["The description must be a string"] });
    });

    it("should a valid category", () => {
      expect.assertions(0);
      const category = new Category({ name: "Movie" });
      category.update("name changed", null);
      category.update("name changed", "some description");
    });
  });
});