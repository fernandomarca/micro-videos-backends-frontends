import { ValidationError } from "../errors/validation-error";

export class ValidatorRules {
  private constructor(private value: any, private property: string) { }

  static values(value: any, property: string) {
    return new ValidatorRules(value, property);
  }

  required(): Omit<this, 'required'> {
    //same !this.value
    if (this.value === null || this.value === undefined || this.value === "") {
      throw new ValidationError(`The ${this.property} is required`);
    }
    return this;
  }
  string(): Omit<this, 'string' | 'required' | 'boolean'> {
    if (!isEmpty(this.value) && typeof this.value !== "string") {
      throw new ValidationError(`The ${this.property} must be a string`);
    }
    return this;
  }
  maxLength(max: number): Omit<this, 'maxLength' | 'required' | 'boolean' | 'string'> {
    if (!isEmpty(this.value) && this.value.length > max) {
      throw new ValidationError(`The ${this.property} must be less than ${max} characters`);
    }
    return this;
  }

  boolean(): Omit<this, 'boolean' | 'required' | 'string' | 'maxLength'> {
    if (!isEmpty(this.value) && typeof this.value !== "boolean") {
      throw new ValidationError(`The ${this.property} must be a boolean`);
    }
    return this;
  }
}

export function isEmpty(value: any) {
  return value === undefined || value === null;
}