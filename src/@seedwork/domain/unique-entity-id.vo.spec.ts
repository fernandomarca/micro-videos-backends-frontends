import { InvalidUuidError } from "../errors/invalid-uuid.error";
import { UniqueEntityId } from "./unique-entity-id.vo";

describe("UniqueEntityId unit tests", () => {
  it("should throw error when uuid is invalid", () => {
    const validateSpy = jest.spyOn(UniqueEntityId.prototype as any, "validate");
    const validUUID = jest.spyOn(UniqueEntityId.prototype as any, "validUUID");

    expect(() => new UniqueEntityId("invalid uuid")).toThrow(new InvalidUuidError("ID must be a valid UUID"));

    expect(validateSpy).toHaveBeenCalled();
    expect(validUUID).toHaveBeenCalled();
  });

  it("should accept a uuid passed in constructor", () => {
    const validateSpy = jest.spyOn(UniqueEntityId.prototype as any, "validate");
    const validUUID = jest.spyOn(UniqueEntityId.prototype as any, "validUUID");

    const uuid = new UniqueEntityId("767d4814-451e-46fe-88e7-511adc91f40e");
    expect(uuid.id).toBe("767d4814-451e-46fe-88e7-511adc91f40e");

    expect(validateSpy).toHaveBeenCalled();
    expect(validUUID).toHaveBeenCalled();
  });
});