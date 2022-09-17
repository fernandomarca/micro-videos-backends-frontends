import { UniqueEntityId } from "../../../@seedwork/domain/value-objects/unique-entity-id.vo";
import { Category } from "./category";

describe('Category Unit Tests', () => {
  test('constructor of category', () => {
    /**
     * type CategoryPropsWithOutCreated_at = Omit<CategoryProps, "created_at">;
     * Usando lodash 
     * let props = omit(category.props, "created_at");
     */
    type CategoryProps = typeof category.props;
    let category = new Category({ name: "Movie" });
    expect(category.props).toStrictEqual<CategoryProps>({
      name: "Movie",
      is_active: true,
      description: null,
      created_at: category.props.created_at
    });
    expect(category.props.created_at).toBeInstanceOf(Date);

    //2
    category = new Category({
      name: "Movie",
      description: "some description",
      is_active: false
    });
    expect(category.props).toStrictEqual<CategoryProps>({
      name: "Movie",
      description: "some description",
      is_active: false,
      created_at: category.props.created_at
    });
    expect(category.props.created_at).toBeInstanceOf(Date);

    //3
    category = new Category({
      name: "Movie",
      description: "other description",
    });
    expect(category.props).toMatchObject<CategoryProps>({
      name: "Movie",
      description: "other description",
    });

    //4
    category = new Category({
      name: "Movie",
      is_active: true,
    });
    expect(category.props).toMatchObject<CategoryProps>({
      name: "Movie",
      is_active: true,
    });

    //5
    let created_at = new Date();
    category = new Category({
      name: "Movie",
      created_at
    });
    expect(category.props).toMatchObject<CategoryProps>({
      name: "Movie",
      created_at
    });
  });

  test("id field", () => {

    const data = [
      { props: { name: "Movie" } },
      { props: { name: "Movie" }, id: null },
      { props: { name: "Movie" }, id: undefined },
      { props: { name: "Movie" }, id: new UniqueEntityId("5b079134-71f2-4aba-b401-a1ffe2963d25") },
    ]

    data.forEach((item) => {
      const category = new Category(item.props, item.id);
      expect(category.id).toBeDefined();
      expect(category.id).not.toBeNull();
      expect(category.uniqueEntityId).toBeInstanceOf(UniqueEntityId);
    });
  });

  test("getter and setter of name prop", () => {
    let category = new Category({ name: "Movie" });
    expect(category.name).toBe("Movie")

    category["name"] = "other name";
    expect(category.name).toBe("other name")
  });

  test("getter and setter of description field", () => {
    let category = new Category({ name: "Movie" });
    expect(category.description).toBeNull();

    category = new Category({ name: "Movie", description: "some description" });
    expect(category.description).toBe("some description");

    category["description"] = "other description";
    expect(category.description).toBe("other description");

    category["description"] = undefined;
    expect(category.description).toBeNull();

  });

  test("getter and setter of is_active", () => {
    let category = new Category({ name: "Movie" });
    expect(category.is_active).toBeTruthy();

    category = new Category({ name: "Movie", is_active: false });
    expect(category.is_active).toBeFalsy()
  });

  test("getter of created_at prop", () => {
    let category = new Category({ name: "Movie" });
    expect(category.created_at).toBeInstanceOf(Date);
    expect(category.created_at).toBeDefined();

    const created_at = new Date();
    category = new Category({ name: "Movie", created_at });
    expect(category.created_at).toBe(created_at);
  });

  it("should update a category", () => {
    const category = new Category({ name: "Movie" });
    category.update("documentary", "some description");

    expect(category.name).toBe("documentary");
    expect(category.description).toBe("some description");
  });

  it("should active a category", () => {
    const category = new Category({ name: "Movie", is_active: false });
    category.activate();
    expect(category.is_active).toBeTruthy();
  });

  it("should disable a category", () => {
    const category = new Category({ name: "Movie" });
    category.deactivate();
    expect(category.is_active).toBeFalsy();
  });
})
