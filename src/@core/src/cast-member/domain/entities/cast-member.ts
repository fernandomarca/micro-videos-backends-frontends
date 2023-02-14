import { Entity, EntityValidationError, UniqueEntityId } from "#seedwork/domain";
import { CastMemberType, Types } from "../value-objects/cast-member-type.vo";

export type CastMemberProperties = {
  name: string;
  type: CastMemberType;
  created_at?: Date;
}

export type CastMemberPropsJson = Required<
  { id: string } & Omit<CastMemberProperties, "type">
> & { type: Types }

export class CastMember extends Entity<
  CastMemberProperties,
  CastMemberPropsJson
>{
  constructor(
    public readonly props: CastMemberProperties,
    id?: UniqueEntityId
  ) {
    super(props, id);
    CastMember.validate(props);
    this.props.created_at = this.props.created_at ?? new Date();
  }

  update(name: string, type: CastMemberType) {
    CastMember.validate({
      name,
      type
    });
    this.name = name;
    this.type = type;
  }

  get name() {
    return this.props.name;
  }

  private set name(value: string) {
    this.props.name = value;
  }

  get type() {
    return this.props.type;
  }

  private set type(value: CastMemberType) {
    this.props.type = value;
  }

  get created_at() {
    return this.props.created_at;
  }

  static validate(props: CastMemberProperties) {
    const validator = CastMemberValidatorFactory.create();
    const isValid = validator.validate(props);
    if (!isValid) {
      throw new EntityValidationError(validator.errors);
    }
  }

  toJSON(): CastMemberPropsJson {
    return {
      id: this.id,
      ...this.props,
      type: this.type.value,
    } as CastMemberPropsJson
  }

}