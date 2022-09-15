import { InvalidUuidError } from "../../../errors/invalid-uuid.error";
import { UniqueEntityId } from "./../unique-entity-id.vo";

function spyValidateMethod() {
  return jest.spyOn(UniqueEntityId.prototype as any, "validate");
}

describe("UniqueEntityId unit tests", () => {
  const validUUID = jest.spyOn(UniqueEntityId.prototype as any, "validUUID");
  beforeEach(() => {
    jest.clearAllMocks();
    validUUID.mockClear();
  });
  it("should throw error when uuid is invalid", () => {
    const validateSpy = spyValidateMethod();

    expect(() => new UniqueEntityId("invalid uuid")).toThrow(new InvalidUuidError("ID must be a valid UUID"));

    expect(validateSpy).toHaveBeenCalled();
    expect(validUUID).toHaveBeenCalled();
  });

  it("should accept a uuid passed in constructor", () => {
    const validateSpy = spyValidateMethod();
    const validUUID = jest.spyOn(UniqueEntityId.prototype as any, "validUUID");

    const uuid = new UniqueEntityId("767d4814-451e-46fe-88e7-511adc91f40e");
    expect(uuid.value).toBe("767d4814-451e-46fe-88e7-511adc91f40e");

    expect(validateSpy).toHaveBeenCalled();
    expect(validUUID).toHaveBeenCalled();
  });
});