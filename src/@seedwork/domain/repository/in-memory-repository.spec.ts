import { Entity } from "../entity/entity";
import { NotFoundError } from "../errors/not-found.error";
import { UniqueEntityId } from "../value-objects/unique-entity-id.vo";
import { InMemoryRepository } from "./in-memory.repository";

type StubEntityProps = {
  name: string;
  price: number;
}

class StubEntity extends Entity<StubEntityProps>{ }

class StubInMemoryRepository extends InMemoryRepository<StubEntity>{ }
describe("InMemoryRepository unit tests", () => {
  let repository: StubInMemoryRepository;
  beforeEach(() => {
    repository = new StubInMemoryRepository();
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
    )
  });
});