import { info } from "console";

export abstract class ValueObject<Value = any>{
  private _value: Value;

  constructor(value: Value) {
    this._value = value;
  }

  get value(): Value {
    return this._value;
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