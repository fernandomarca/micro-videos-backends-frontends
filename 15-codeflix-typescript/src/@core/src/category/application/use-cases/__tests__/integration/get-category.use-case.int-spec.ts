import { NotFoundError } from "#seedwork/domain/errors/not-found.error";
import { GetCategoryUseCase } from "../../get-category.use-case";
import { CategorySequelize } from "#category/infra/db/sequelize/category-sequelize";
import { setupSequelize } from "#seedwork/infra/testing/helpers/db";

const { CategoryModel, CategorySequelizeRepository: CategoryRepository } = CategorySequelize;

describe("GetCategoryUseCase integration Tests", () => {
  let useCase: GetCategoryUseCase.UseCase;
  let repository: CategorySequelize.CategorySequelizeRepository;

  setupSequelize({ models: [CategoryModel] });

  beforeEach(() => {
    repository = new CategoryRepository(CategoryModel);
    useCase = new GetCategoryUseCase.UseCase(repository);
  });

  it("should throws error when entity not found", async () => {
    await expect(() => useCase.execute({ id: "fake id" })).rejects.toThrow(new NotFoundError("Entity Not Found using ID fake id"));

  });
  it("should returns a category", async () => {
    const model = await CategoryModel.factory().create();
    let output = await useCase.execute({ id: model.id });
    expect(output).toStrictEqual(model.toJSON());
  });
});