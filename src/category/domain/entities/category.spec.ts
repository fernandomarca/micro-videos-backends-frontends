import { Category } from "./category"

describe('Category Unit Tests', () => {
  test('constructor of category', () => {
    type CategoryType = typeof props;
    const props = {
      name: 'Movie',
      description: "description",
      is_active: true,
      created_at: new Date(),
      value: "value"
    }
    const category = new Category(
      props);
    // expect(category.props.name).toBe("Movie");
    // expect(category.props.description).toBe("description");
    // expect(category.props.is_active).toBeTruthy();
    // expect(category.props.created_at).toBe(props.created_at);
    expect(category.props).toStrictEqual<CategoryType>(props);
  })
})
