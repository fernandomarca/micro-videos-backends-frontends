import { Entity } from "../../entity/entity";
import { NotFoundError } from "../../errors/not-found.error";
import { UniqueEntityId } from "../../value-objects/unique-entity-id.vo";
import { InMemoryRepository } from "../in-memory.repository";

type StubEntityProps = {
  name: string;
  price: number;
}

class StubEntity extends Entity<StubEntityProps>{ }

class StubInMemoryRepository extends InMemoryRepository<StubEntity>{
}
describe("InMemoryRepository unit tests", () => {
  let repository: StubInMemoryRepository;
  beforeEach(() => {
    repository = new StubInMemoryRepository();
  });

  it("should finds a entity by id", async () => {
    const entity = new StubEntity({ name: "Movie", price: 5 });
    await repository.insert(entity);

    let entityFound = await repository.findById(entity.id);
    expect(entityFound.toJSON()).toStrictEqual(entity.toJSON());

    entityFound = await repository.findById(entity.uniqueEntityId);
    expect(entityFound.toJSON()).toStrictEqual(entity.toJSON());
  });

  it("should inserts a new entity", async () => {
    const entity = new StubEntity({
      name: "Movie",
      price: 5,
    });
    await repository.insert(entity);
    expect(entity.toJSON()).toStrictEqual((await repository.findAll())[0].toJSON());
  });

  it("should throws error when entity not found", () => {
    expect(repository.findById('fake id')).rejects.toThrow(
      new NotFoundError('Entity Not Found using ID fake id')
    );

    expect(repository.findById(new UniqueEntityId("767d4814-451e-46fe-88e7-511adc91f40e"))).rejects.toThrow(
      new NotFoundError('Entity Not Found using ID 767d4814-451e-46fe-88e7-511adc91f40e')
    );
  });

  it("should returns all entities", async () => {
    const entity = new StubEntity({ name: "Movie", price: 5 });
    await repository.insert(entity);
    const entities = await repository.findAll();
    expect(entities).toStrictEqual([entity]);
  });

  it("should throws error on update when entity not found", () => {
    const entity = new StubEntity({ name: "Movie", price: 5 });
    expect(repository.update(entity)).rejects.toThrow(
      new NotFoundError(`Entity Not Found using ID ${entity.id}`)
    );
  });

  it("should throws error on delete when entity not found", () => {
    expect(repository.delete('fake id')).rejects.toThrow(
      new NotFoundError('Entity Not Found using ID fake id')
    );

    expect(repository.delete(new UniqueEntityId("767d4814-451e-46fe-88e7-511adc91f40e"))).rejects.toThrow(
      new NotFoundError('Entity Not Found using ID 767d4814-451e-46fe-88e7-511adc91f40e')
    );
  });

  it("should updates an entity", async () => {
    const entity = new StubEntity({ name: "Movie", price: 5 });
    await repository.insert(entity);

    const entityUpdated = new StubEntity({ name: "updated", price: 1 }, entity.uniqueEntityId);

    await repository.update(entityUpdated);
    expect(entityUpdated.toJSON()).toStrictEqual((await repository.findById(entity.id)).toJSON());
  });

  it("should deletes an entity", async () => {
    const entity = new StubEntity({ name: "Movie", price: 5 });
    await repository.insert(entity);

    await repository.delete(entity.id);
    expect(await repository.findAll()).toHaveLength(0);

    await repository.insert(entity);

    await repository.delete(entity.uniqueEntityId);
    expect(await repository.findAll()).toHaveLength(0);
  });
});