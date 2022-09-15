import { InvalidUuidError } from "../../../@seedwork/errors/invalid-uuid.error";
import { randomUUID } from "node:crypto";
import { ValueObject } from "./value-object";

export class UniqueEntityId extends ValueObject<string> {
  constructor(private id?: string) {
    super(id || randomUUID());
    this.validate();
  }

  private validate() {
    const isValid = this.validUUID(this.value);
    if (!isValid) {
      throw new InvalidUuidError();
    }
  }

  private validUUID(uuid: string) {
    // Regular expression to check if string is a valid UUID
    const regexExp = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;
    return regexExp.test(uuid);
  }
}
