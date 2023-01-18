import { randomUUID } from "crypto";
import { validUUID } from "../utils/validUUID";
import { UniqueEntityId } from "../value-objects/unique-entity-id.vo";
import { Entity } from "./entity";

class StubEntity extends Entity<{ prop1: string; prop2: number }>{
  toJSON(): Required<{ id: string; } & { prop1: string; prop2: number; }> {
    return {
      id: this.id,
      prop1: this.props.prop1,
      prop2: this.props.prop2
    }
  }
}
describe("Entity Unit Tests", () => {
  it("should set props and id", () => {
    const arrange = { prop1: "value1", prop2: 10 };
    const entity = new StubEntity(arrange);
    expect(entity.props).toStrictEqual(arrange);
    expect(entity.uniqueEntityId).toBeInstanceOf(UniqueEntityId);
    expect(entity.id).not.toBeNull();
    expect(validUUID(entity.id)).toBe(true);
  });

  it("should accept a valid uuid", () => {
    const arrange = { prop1: "value1", prop2: 10 };
    const uniqueEntityId = new UniqueEntityId();
    const entity = new StubEntity(arrange, uniqueEntityId);

    expect(entity.uniqueEntityId).toBeInstanceOf(UniqueEntityId);
    expect(entity.id).not.toBeNull();
    expect(validUUID(entity.id)).toBe(true);
    expect(entity.id).toBe(uniqueEntityId.value);
  });

  it("should convert a entity to a javascript object", () => {
    const arrange = { prop1: "value1", prop2: 10 };
    const uniqueEntityId = new UniqueEntityId();
    const entity = new StubEntity(arrange, uniqueEntityId);

    expect(entity.toJSON()).toStrictEqual({
      id: entity.id,
      ...arrange
    })
  });
});