import { ValueObject } from "../value-object";

export class StubValueObject extends ValueObject {

}

describe("ValueObject unit Tests", () => {
  it("should set value", () => {
    let vo = new StubValueObject("string value");
    expect(vo.value).toBe("string value");

    vo = new StubValueObject({ prop1: "value1" });
    expect(vo.value).toStrictEqual({ prop1: "value1" });
  });

  describe("should convert to a string", () => {
    const date = new Date();
    const arrange = [
      // { received: null, expect: "null" },
      // { received: undefined, expect: "undefined" },
      { received: { prop1: "value" }, expect: JSON.stringify({ prop1: "value" }) },
      { received: "", expect: "" },
      { received: 0, expect: "0" },
      { received: true, expect: "true" },
      { received: false, expect: "false" },
      { received: 5, expect: "5" },
      { received: date, expect: date.toString() },
      { received: "teste fake", expect: "teste fake" },
    ];

    test.each(arrange)("from %p", (item) => {
      const vo = new StubValueObject(item.received);
      expect(vo + "").toBe(item.expect);
    });
  });
});