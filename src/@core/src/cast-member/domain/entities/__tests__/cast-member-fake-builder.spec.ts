import { CastMemberType, Types } from "../../value-objects/cast-member-type.vo";
import { CastMemberFakeBuilder } from "../cast-member-fake-builder";

describe("CastMemberFakerBuilder Unit Tests", () => {
  it("create cast member types", () => {
    let faker = CastMemberFakeBuilder.anActor();
    expect(faker.type).toBeInstanceOf(CastMemberType);
    expect(faker.type.value).toBe(Types.ACTOR);

    faker = CastMemberFakeBuilder.aDirector();
    expect(faker.type).toBeInstanceOf(CastMemberType);
    expect(faker.type.value).toBe(Types.DIRECTOR);

    const castMembers = CastMemberFakeBuilder.theCastMembers(2).build();
    expect(castMembers[0].type).toBeInstanceOf(CastMemberType);
    expect(castMembers[1].type).toBeInstanceOf(CastMemberType);
  });


  describe("type prop", () => {
    const faker = CastMemberFakeBuilder.anActor();
    it("should be a CastMemberType", () => {
      expect(faker["_type"]).toBeInstanceOf(CastMemberType);
    });

    test("withType", () => {
      const director = CastMemberType.createADirector();
      const $this = faker.withType(director);
      expect($this).toBeInstanceOf(CastMemberFakeBuilder);
      expect(faker.type).toEqual(director);

      const actor = CastMemberType.createAnActor();
      faker.withType(() => actor);
      //@ts-expect-error name is callable
      expect(faker["_type"]()).toEqual(actor);
      expect(faker.type).toEqual(actor);
    });

    describe("created_at prop", () => { });
  });
});