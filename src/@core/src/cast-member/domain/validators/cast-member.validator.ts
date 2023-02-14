import { ClassValidatorFields } from "#seedwork/domain";
import { IsDate, IsInstance, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";
import { CastMemberProperties } from "../entities/cast-member";
import { CastMemberType } from "../value-objects/cast-member-type.vo";


export class CastMemberRules {
  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  name: string;

  //@ts-expect-error - The constructor must be private
  @IsInstance(CastMemberType.CastMemberType)
  @IsNotEmpty()
  type: CastMemberType;

  @IsDate()
  @IsOptional()
  created_at: Date;

  constructor({ name, type, created_at }: CastMemberProperties) {
    Object.assign(this, { name, type, created_at });
  }
}

export class CastMemberValidator extends ClassValidatorFields<CastMemberRules>{
  validate(data: CastMemberProperties) {
    return super.validate(new CastMemberRules(data ?? ({} as any)));
  }
}