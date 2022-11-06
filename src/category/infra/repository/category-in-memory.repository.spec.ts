import { Category } from "../../../category/domain/entities/category";
import { CategoryInMemoryRepository } from "./category-in-memory.repository";

describe("CategoryInMemoryRepository", () => {
  let repository: CategoryInMemoryRepository;

  beforeEach(() => (repository = new CategoryInMemoryRepository()));

  it("should no filter items when filter object in null", async () => {
    const items = [new Category({ name: "test" })];
    const spyFilterMethod = jest.spyOn(items, 'filter');

    let itemsFiltered = await repository["applyFilter"](items, null);
    expect(spyFilterMethod).not.toHaveBeenCalled();
    expect(itemsFiltered).toStrictEqual(itemsFiltered);
  });

  it("should filter items using filter parameter", async () => {

    const items = [
      new Category({ name: "test" }),
      new Category({ name: "TEST" }),
      new Category({ name: "fake" }),
    ];

    const spyFilterMethod = jest.spyOn(items, 'filter');

    let itemsFiltered = await repository["applyFilter"](items, "TEST");
    expect(spyFilterMethod).toHaveBeenCalledTimes(1);
    expect(itemsFiltered).toStrictEqual([items[0], items[1]]);
  });

  it("should sort by created_at when sort param is null", async () => {
    const created_at = new Date();
    const items = [
      new Category({ name: "test", created_at }),
      new Category({ name: "TEST", created_at: new Date(created_at.getTime() + 100) }),
      new Category({ name: "fake", created_at: new Date(created_at.getTime() + 200) }),
    ];

    let itemsFiltered = await repository["applySort"](items, null, null);
    expect(itemsFiltered).toStrictEqual([items[2], items[1], items[0]]);
  });

  it("should sort by name", async () => {
    const items = [
      new Category({ name: "c" }),
      new Category({ name: "b" }),
      new Category({ name: "a" }),
    ];

    let itemsFiltered = await repository["applySort"](items, "name", "asc");
    expect(itemsFiltered).toStrictEqual([items[2], items[1], items[0]]);

    itemsFiltered = await repository["applySort"](items, "name", "desc");
    expect(itemsFiltered).toStrictEqual([items[0], items[1], items[2]]);
  });
});