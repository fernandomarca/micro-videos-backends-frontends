export abstract class ValueObject<Value = any>{
  private _value: Value;

  constructor(value: Value) {
    this._value = value;
  }

  get value(): Value {
    return this._value;
  }
}