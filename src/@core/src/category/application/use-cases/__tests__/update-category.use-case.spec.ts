import { Category } from "../../../../category/domain/entities/category";
import { NotFoundError } from "../../../../@seedwork/domain/errors/not-found.error";
import { CategoryInMemoryRepository } from "../../../infra/repository/category-in-memory.repository";
import { UpdateCategoryUseCase } from "../update-category.use-case";

describe("UpdateCategoryUseCase Unit Tests", () => {
  let useCase: UpdateCategoryUseCase.UseCase;
  let repository: CategoryInMemoryRepository;
  beforeEach(() => {
    repository = new CategoryInMemoryRepository();
    useCase = new UpdateCategoryUseCase.UseCase(repository);
  });

  it("should throws error when entity not found", async () => {
    expect(() => useCase.execute({ id: "fake id", name: "fake" })).rejects.toThrow(new NotFoundError("Entity Not Found using ID fake id"));

  });

  it("should Update a category", async () => {
    const spyUpdate = jest.spyOn(repository, "update");
    const entity = new Category({ name: "Movie" });
    repository.items = [entity];
    let output = await useCase.execute({
      id: entity.id,
      name: "test"
    });
    expect(spyUpdate).toHaveBeenCalledTimes(1);
    expect(output).toStrictEqual({
      id: repository.items[0].id,
      name: "test",
      description: null,
      is_active: true,
      created_at: repository.items[0].created_at,
    });
    type Arrange = {
      input: { id: string, name: string, description?: string, is_active?: boolean, },
      expect: { id: string, name: string, description: string, is_active: boolean, created_at: Date }
    }
    const arrange: Arrange[] = [
      {
        input: {
          id: entity.id,
          name: "test",
          description: "some description"
        },
        expect: {
          id: repository.items[0].id,
          name: "test",
          description: "some description",
          is_active: true,
          created_at: repository.items[0].created_at,
        }
      },
      {
        input: {
          id: entity.id,
          name: "test",
        },
        expect: {
          id: repository.items[0].id,
          name: "test",
          description: null,
          is_active: true,
          created_at: repository.items[0].created_at,
        }
      },
      {
        input: {
          id: entity.id,
          name: "test",
          is_active: false
        },
        expect: {
          id: repository.items[0].id,
          name: "test",
          description: null,
          is_active: false,
          created_at: repository.items[0].created_at,
        }
      },
      {
        input: {
          id: entity.id,
          name: "test",
        },
        expect: {
          id: repository.items[0].id,
          name: "test",
          description: null,
          is_active: false,
          created_at: repository.items[0].created_at,
        }
      },
      {
        input: {
          id: entity.id,
          name: "test",
          is_active: true
        },
        expect: {
          id: repository.items[0].id,
          name: "test",
          description: null,
          is_active: true,
          created_at: repository.items[0].created_at,
        }
      },
      {
        input: {
          id: entity.id,
          name: "test",
          description: "some description",
          is_active: false
        },
        expect: {
          id: repository.items[0].id,
          name: "test",
          description: "some description",
          is_active: false,
          created_at: repository.items[0].created_at,
        }
      }
    ];

    // arrange.forEach(async (i) => {
    //   output = await useCase.execute(i.input);
    //   expect(output).toStrictEqual(i.expect);
    // });

    for (const i of arrange) {
      output = await useCase.execute(i.input);
      expect(output).toStrictEqual(i.expect);
    }
  });
});