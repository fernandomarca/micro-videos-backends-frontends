import { Category } from "#category/domain";
import { NotFoundError, UniqueEntityId } from "#seedwork/domain";
import { setupSequelize } from "#seedwork/infra/testing/helpers/db";
import { CategoryModel } from "./category-model";
import { CategorySequelizeRepository } from "./category-repository";

describe("CategorySequelizeRepository unit tests", () => {
  setupSequelize({ models: [CategoryModel] });
  let repository: CategorySequelizeRepository;

  beforeEach(async () => {
    repository = new CategorySequelizeRepository(CategoryModel)
  });

  it('should insert a new entity', async () => {
    let category = new Category({
      name: "Movie"
    });
    await repository.insert(category);
    let model = await CategoryModel.findByPk(category.id);

    expect(model.toJSON()).toStrictEqual(category.toJSON());

    category = new Category({
      name: "Movie",
      description: "some description",
      is_active: false
    });

    await repository.insert(category);
    model = await CategoryModel.findByPk(category.id);

    expect(model.toJSON()).toStrictEqual(category.toJSON());
  });

  it("should throws error when entity not found", async () => {
    await expect(repository.findById('fake id')).rejects.toThrow(
      new NotFoundError('Entity Not Found using ID fake id')
    );

    await expect(repository.findById(new UniqueEntityId("767d4814-451e-46fe-88e7-511adc91f40e"))).rejects.toThrow(
      new NotFoundError('Entity Not Found using ID 767d4814-451e-46fe-88e7-511adc91f40e')
    );
  });

  it('should findById a entity', async () => {
    let category = new Category({
      name: "Movie"
    });
    await repository.insert(category);
    let model = await repository.findById(category.id);
    expect(model.toJSON()).toStrictEqual(category.toJSON());

    model = await repository.findById(category.uniqueEntityId);
    expect(model.toJSON()).toStrictEqual(category.toJSON());
  });

  it('should return all categories', async () => {
    const entity = new Category({ name: "Movie" });
    await repository.insert(entity);
    const entities = await repository.findAll();
    expect(entities).toHaveLength(1);
    expect(JSON.stringify(entities)).toBe(JSON.stringify([entity]));
  });
});