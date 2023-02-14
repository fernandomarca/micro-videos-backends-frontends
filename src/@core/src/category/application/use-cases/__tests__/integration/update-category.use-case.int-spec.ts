import { Category } from "../../../../domain/entities/category";
import { NotFoundError } from "../../../../../@seedwork/domain/errors/not-found.error";
import { UpdateCategoryUseCase } from "../../update-category.use-case";
import { setupSequelize } from "#seedwork/infra/testing/helpers/db";
import { CategorySequelize } from "#category/infra/db/sequelize/category-sequelize";

const { CategoryModel, CategorySequelizeRepository: CategoryRepository } = CategorySequelize;

describe("UpdateCategoryUseCase Integration Tests", () => {
  let useCase: UpdateCategoryUseCase.UseCase;
  let repository: CategorySequelize.CategorySequelizeRepository;

  setupSequelize({ models: [CategoryModel] });

  beforeEach(() => {
    repository = new CategoryRepository(CategoryModel);
    useCase = new UpdateCategoryUseCase.UseCase(repository);
  });

  it("should throws error when entity not found", async () => {
    await expect(() => useCase.execute({ id: "fake id", name: "fake" })).rejects.toThrow(new NotFoundError("Entity Not Found using ID fake id"));
  });

  it("should Update a category", async () => {
    const entity = Category.fake().aCategory().build();
    await repository.insert(entity);

    // const model = await CategoryModel.factory().
    // create();

    let output = await useCase.execute({
      id: entity.id,
      name: "test"
    });
    expect(output).toStrictEqual({
      id: entity.id,
      name: "test",
      description: null,
      is_active: true,
      created_at: entity.created_at,
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
          id: entity.id,
          name: "test",
          description: "some description",
          is_active: true,
          created_at: entity.created_at,
        }
      },
      {
        input: {
          id: entity.id,
          name: "test",
        },
        expect: {
          id: entity.id,
          name: "test",
          description: null,
          is_active: true,
          created_at: entity.created_at,
        }
      },
      {
        input: {
          id: entity.id,
          name: "test",
          is_active: false
        },
        expect: {
          id: entity.id,
          name: "test",
          description: null,
          is_active: false,
          created_at: entity.created_at,
        }
      },
      {
        input: {
          id: entity.id,
          name: "test",
        },
        expect: {
          id: entity.id,
          name: "test",
          description: null,
          is_active: false,
          created_at: entity.created_at,
        }
      },
      {
        input: {
          id: entity.id,
          name: "test",
          is_active: true
        },
        expect: {
          id: entity.id,
          name: "test",
          description: null,
          is_active: true,
          created_at: entity.created_at,
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
          id: entity.id,
          name: "test",
          description: "some description",
          is_active: false,
          created_at: entity.created_at,
        }
      }
    ];

    for (const i of arrange) {
      output = await useCase.execute(
        {
          id: i.input.id,
          name: i.input.name,
          description: i.input.description,
          is_active: i.input.is_active
        }
      );
      const entityUpdated = await repository.findById(i.input.id);
      expect(output).toStrictEqual({
        id: entity.id,
        name: i.expect.name,
        description: i.expect.description,
        is_active: i.expect.is_active,
        created_at: entityUpdated.created_at
      });
      expect(entityUpdated.toJSON()).toStrictEqual({
        id: entity.id,
        name: i.expect.name,
        description: i.expect.description,
        is_active: i.expect.is_active,
        created_at: entityUpdated.created_at
      });
    }
  });
});