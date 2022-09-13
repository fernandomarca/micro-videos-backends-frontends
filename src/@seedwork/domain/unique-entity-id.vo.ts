import { InvalidUuidError } from "../../@seedwork/errors/invalid-uuid.error";
import { randomUUID } from "node:crypto";

export class UniqueEntityId {
  constructor(readonly id?: string) {
    this.id = id || randomUUID();
    this.validate();
  }

  private validate() {
    const isValid = this.validUUID(this.id);
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