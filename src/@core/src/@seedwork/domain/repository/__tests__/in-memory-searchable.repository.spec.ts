import { Entity } from "../../entity/entity";
import { InMemorySearchableRepository } from "../in-memory.repository";
import { SearchParams, SearchResult } from "../repository-contracts";

type StubEntityProps = {
  name: string,
  price: number
}

class StubEntity extends Entity<StubEntityProps>{
  toJSON(): Required<{ id: string; } & StubEntityProps> {
    return {
      id: this.id,
      name: this.props.name,
      price: this.props.price
    }
  }
}

class StubInMemorySearchableRepository extends InMemorySearchableRepository<StubEntity>{
  sortableFields: string[] = ["name"];

  protected async applyFilter(
    items: StubEntity[],
    filter: string | null
  ): Promise<StubEntity[]> {
    if (!filter) {
      return items;
    }

    return items.filter((item) => {
      return (
        item.props.name.toLowerCase().includes(filter.toLowerCase()) ||
        item.props.price.toString() === filter
      )
    });
  }
}

describe("InMemorySearchableRepository Unit tests", () => {
  let repository: StubInMemorySearchableRepository;
  let items: any;
  beforeEach(() => {
    repository = new StubInMemorySearchableRepository();
    repository.items = items;
  });

  describe("applyFilter method", () => {
    it("should no filter items when filter param is null", async () => {
      items = [new StubEntity({ name: "name value", price: 5 })];
      const spyFilterMethod = jest.spyOn(items, 'filter');
      const itemsFiltered = await repository['applyFilter'](items, null);
      expect(itemsFiltered).toStrictEqual(items);
      expect(spyFilterMethod).not.toHaveBeenCalled();
    });

    it("should filter using a filter param", async () => {
      items = [
        new StubEntity({ name: "test", price: 5 }),
        new StubEntity({ name: "TEST", price: 5 }),
        new StubEntity({ name: "fake", price: 0 }),
      ];
      const spyFilterMethod = jest.spyOn(items, 'filter');
      let itemsFiltered = await repository['applyFilter'](items, "TEST");

      expect(itemsFiltered).toStrictEqual([items[0], items[1]]);
      expect(spyFilterMethod).toHaveBeenCalledTimes(1);

      itemsFiltered = await repository['applyFilter'](items, "5");
      expect(itemsFiltered).toStrictEqual([items[0], items[1]]);
      expect(spyFilterMethod).toHaveBeenCalledTimes(2);

      itemsFiltered = await repository['applyFilter'](items, "0");
      expect(itemsFiltered).toStrictEqual([items[2]]);
      expect(spyFilterMethod).toHaveBeenCalledTimes(3);

      itemsFiltered = await repository['applyFilter'](items, "no-filter");
      expect(itemsFiltered).toHaveLength(0);
      expect(spyFilterMethod).toHaveBeenCalledTimes(4);

    });
  });
  describe("applySort method", () => {
    it("should no sort items", async () => {
      items = [
        new StubEntity({ name: "b", price: 5 }),
        new StubEntity({ name: "a", price: 5 }),
      ];

      let itemsSorted = await repository['applySort'](items, null, null);
      expect(itemsSorted).toStrictEqual(items);

      itemsSorted = await repository['applySort'](items, "price", "asc");
      expect(itemsSorted).toStrictEqual(items);
    });

    it("should sort items", async () => {
      items = [
        new StubEntity({ name: "b", price: 5 }),
        new StubEntity({ name: "a", price: 5 }),
        new StubEntity({ name: "c", price: 5 }),
      ];

      let itemsSorted = await repository['applySort'](items, "name", "asc");
      expect(itemsSorted).toStrictEqual([items[1], items[0], items[2]]);

      itemsSorted = await repository['applySort'](items, "name", "desc");
      expect(itemsSorted).toStrictEqual([items[2], items[0], items[1]]);
    });
  });
  describe("applyPaginate method", () => {
    it("should paginate items", async () => {
      items = [
        new StubEntity({ name: "a", price: 5 }),
        new StubEntity({ name: "b", price: 5 }),
        new StubEntity({ name: "c", price: 5 }),
        new StubEntity({ name: "d", price: 5 }),
        new StubEntity({ name: "e", price: 5 }),
      ];

      let itemsSorted = await repository['applyPaginate'](items, 1, 2);
      expect(itemsSorted).toStrictEqual([items[0], items[1]]);

      itemsSorted = await repository['applyPaginate'](items, 2, 2);
      expect(itemsSorted).toStrictEqual([items[2], items[3]]);

      itemsSorted = await repository['applyPaginate'](items, 3, 2);
      expect(itemsSorted).toStrictEqual([items[4]]);

      itemsSorted = await repository['applyPaginate'](items, 4, 2);
      expect(itemsSorted).toStrictEqual([]);
    });


  });
  describe("search method", () => {
    it("should apply only paginate when other params are null", async () => {
      const entity = new StubEntity({ name: "a", price: 5 });
      const items = Array(16).fill(entity);
      repository.items = items;

      const result = await repository.search(new SearchParams());

      expect(result).toStrictEqual(new SearchResult({
        items: Array(15).fill(entity),
        total: 16,
        current_page: 1,
        per_page: 15,
        sort: null,
        sort_dir: null,
        filter: null
      }))
    });

    it("should apply paginate and filter", async () => {
      const items = [
        new StubEntity({ name: "teste", price: 5 }),
        new StubEntity({ name: "a", price: 5 }),
        new StubEntity({ name: "TEST", price: 5 }),
        new StubEntity({ name: "TeSt", price: 5 }),
      ];
      repository.items = items;

      let result = await repository.search(new SearchParams(
        {
          page: 1,
          per_page: 2,
          filter: "TEST"
        }
      ));

      expect(result).toStrictEqual(new SearchResult({
        items: [items[0], items[2]],
        total: 3,
        current_page: 1,
        per_page: 2,
        sort: null,
        sort_dir: null,
        filter: "TEST"
      }));

      result = await repository.search(new SearchParams(
        {
          page: 2,
          per_page: 2,
          filter: "TEST"
        }
      ));

      expect(result).toStrictEqual(new SearchResult({
        items: [items[3]],
        total: 3,
        current_page: 2,
        per_page: 2,
        sort: null,
        sort_dir: null,
        filter: "TEST"
      }));
    });
  });

  describe("should apply paginate and sort", () => {
    const items = [
      new StubEntity({ name: "b", price: 5 }),
      new StubEntity({ name: "a", price: 5 }),
      new StubEntity({ name: "d", price: 5 }),
      new StubEntity({ name: "e", price: 5 }),
      new StubEntity({ name: "c", price: 5 }),
    ];

    const arrange = [
      {
        params: new SearchParams({ page: 1, per_page: 2, sort: "name" }),
        result: new SearchResult({
          items: [items[1], items[0]],
          total: 5,
          current_page: 1,
          per_page: 2,
          sort: "name",
          sort_dir: "asc",
          filter: null
        })
      },
      {
        params: new SearchParams({ page: 2, per_page: 2, sort: "name" }),
        result: new SearchResult({
          items: [items[4], items[2]],
          total: 5,
          current_page: 2,
          per_page: 2,
          sort: "name",
          sort_dir: "asc",
          filter: null
        })
      },
      {
        params: new SearchParams({ page: 1, per_page: 2, sort: "name", sort_dir: "desc" }),
        result: new SearchResult({
          items: [items[3], items[2]],
          total: 5,
          current_page: 1,
          per_page: 2,
          sort: "name",
          sort_dir: "desc",
          filter: null
        })
      },
      {
        params: new SearchParams({ page: 2, per_page: 2, sort: "name", sort_dir: "desc" }),
        result: new SearchResult({
          items: [items[4], items[0]],
          total: 5,
          current_page: 2,
          per_page: 2,
          sort: "name",
          sort_dir: "desc",
          filter: null
        })
      }
    ];

    test.each(arrange)("when value is %j", async ({ params, result: search_result }) => {
      repository.items = items;
      let result = await repository.search(new SearchParams(params));
      expect(result).toStrictEqual(new SearchResult(search_result));
    });
  });

  describe("should search using filter, sort and paginate", () => {
    const items = [
      new StubEntity({ name: "test", price: 5 }),
      new StubEntity({ name: "a", price: 5 }),
      new StubEntity({ name: "TEST", price: 5 }),
      new StubEntity({ name: "e", price: 5 }),
      new StubEntity({ name: "TeSt", price: 5 }),
    ];

    const arrange = [
      {
        params: new SearchParams({ page: 1, per_page: 2, sort: "name", filter: "TEST" }),
        result: new SearchResult({
          items: [items[2], items[4]],
          total: 3,
          current_page: 1,
          per_page: 2,
          sort: "name",
          sort_dir: "asc",
          filter: "TEST"
        })
      },
      {
        params: new SearchParams({ page: 2, per_page: 2, sort: "name", filter: "TEST" }),
        result: new SearchResult({
          items: [items[0]],
          total: 3,
          current_page: 2,
          per_page: 2,
          sort: "name",
          sort_dir: "asc",
          filter: "TEST"
        })
      },
      {
        params: new SearchParams({ page: 1, per_page: 2, sort: "price", filter: "5" }),
        result: new SearchResult({
          items: [items[0], items[1]],
          total: 5,
          current_page: 1,
          per_page: 2,
          sort: "price",
          sort_dir: "asc",
          filter: "5"
        })
      },
    ];

    test.each(arrange)("when value is %j", async ({ params, result: result_params }) => {
      repository.items = items;
      let result = await repository.search(new SearchParams(params));
      expect(result).toStrictEqual(new SearchResult(result_params));
    });
  });

});