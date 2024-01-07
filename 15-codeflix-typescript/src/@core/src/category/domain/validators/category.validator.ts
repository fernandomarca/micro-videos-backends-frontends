import { MaxLength } from "class-validator";
import { ClassValidatorFields } from "../../../@seedwork/domain/validators/class-validator";
import { Category } from "../entities/category";
import { Notification } from "#seedwork/domain/validators/notification";

export class CategoryRules {
  @MaxLength(255, { groups: ['name'] })
  // @IsString()
  // @IsNotEmpty()
  name: string;

  // @IsString()
  // @IsOptional()
  // description: string;

  // @IsBoolean()
  // @IsOptional()
  // is_active: boolean;

  // @IsDate()
  // @IsOptional()
  // created_at: Date;

  //   constructor({ name, description, is_active, created_at }: CategoryProperties) {
  //     Object.assign(this, { name, description, is_active, created_at });
  //   }
  // }
  constructor(entity: Category) {
    Object.assign(this, entity);
  }
}

// export class CategoryValidator extends ClassValidatorFields<CategoryRules> {
//   validate(data: CategoryProperties): boolean {
//     return super.validate(new CategoryRules(data ?? {} as any));
//   }
// }

export class CategoryValidator extends ClassValidatorFields {
  validate(notification: Notification, data: any, fields?: string[]): boolean {
    const newFields = fields?.length ? fields : ['name'];
    return super.validate(notification, new CategoryRules(data), newFields);
  }
}

export default class CategoryValidatorFactory {
  static create() {
    return new CategoryValidator();
  }
}