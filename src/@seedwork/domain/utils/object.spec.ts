import { StubValueObject } from "../value-objects/__tests__/value-object.spec";
import { deepFreeze } from "./object";
describe('object unit Tests', () => {

  it("should not freeze a scalar value", () => {

    const str = deepFreeze("a");
    expect(typeof str).toBe("string");

    const boolean = deepFreeze(true);
    expect(typeof boolean).toBe("boolean");

    const num = deepFreeze(5);
    expect(typeof num).toBe("number");
  });
  it("should be a immutable obj", () => {
    const obj = deepFreeze(
      {
        prop1: "value1",
        deep: {
          prop2: "value2",
          prop3: new Date()
        }
      }
    );

    const vo = new StubValueObject(obj);

    expect(() => {
      (vo as any).value.prop1 = "change prop1";
    }).toThrow("Cannot assign to read only property 'prop1' of object '#<Object>'");

    expect(() => {
      (vo as any).value.deep.prop2 = "change prop2";
    }).toThrow("Cannot assign to read only property 'prop2' of object '#<Object>'");

    expect(vo.value.deep.prop3).toBeInstanceOf(Date);
  });
});