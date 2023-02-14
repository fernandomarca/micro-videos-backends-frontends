import isEqual from "lodash/isEqual";
import { deepFreeze } from "../utils/object";

export abstract class ValueObject<Value = any>{
  private readonly _value: Value;

  constructor(value: Value) {
    this._value = deepFreeze(value);
  }

  get value(): Value {
    return this._value;
  }

  public equals(obj: this): boolean {
    if (obj === null || obj === undefined) {
      return false;
    }

    if (obj.value === undefined) {
      return false;
    }

    if (obj.constructor.name !== this.constructor.name) {
      return false;
    }

    return isEqual(this.value, obj.value);
    // return isDeepStrictEqual(this.value, obj.value);
  }

  toString = () => {
    if (typeof this.value !== "object" || this.value === null) {
      try {
        this.value.toString();
      } catch (error) {
        return this.value + ""
      }
    }

    const valueStr = this.value.toString();
    return valueStr === "[object Object]" ? JSON.stringify(this.value) : valueStr;
  }
}