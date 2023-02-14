import { Either } from "./either";

describe("Either unit Tests", () => {
  it('should an Array instance', () => {
    const either = new Either(1, 2);

    expect(either).toBeInstanceOf(Array);
  });

  test('constructor', () => {
    const either = new Either(1, 2);

    expect(either[0]).toBe(1);
    expect(either[1]).toBe(2);
  });

  test('ok', () => {
    const either = Either.ok(1);

    expect(either[0]).toBe(1);
    expect(either[1]).toBe(null);
  });

  test('fail', () => {
    const either = Either.fail(0);

    expect(either[0]).toBe(null);
    expect(either[1]).toBe(0);
  });

  test('getOk', () => {
    const either = Either.ok(1);

    expect(either.getOk()).toBe(1);
  });

  test('getFail', () => {
    const either = Either.fail(0);

    expect(either.getFail()).toBe(0);
  });

  test('isOk', () => {
    const either = Either.ok(1);

    expect(either.isOk()).toBeTruthy();
    expect(either.isFail()).toBeFalsy();
  });

  test('isFail', () => {
    const either = Either.fail(0);

    expect(either.isFail()).toBeTruthy();
    expect(either.isOk()).toBeFalsy();

  });
});