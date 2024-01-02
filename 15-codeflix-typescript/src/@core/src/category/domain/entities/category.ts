import { Entity } from "#seedwork/domain/entity/entity";
import { UniqueEntityId } from "#seedwork/domain/value-objects/unique-entity-id.vo";
import CategoryValidatorFactory from "#category/domain/validators/category.validator";
import { CategoryFakeBuilder } from "./category-fake-builder";
import { ValueObject } from "#seedwork/domain/value-objects/value-object";

export type CategoryProperties = {
  name: string;
  description?: string;
  is_active?: boolean;
  created_at?: Date;
}

export type CategoryPropsJson = Required<{ id: string } & CategoryProperties>
export class Category extends Entity<CategoryProperties, CategoryPropsJson> {

  constructor(
    readonly props: CategoryProperties,
    id?: UniqueEntityId
  ) {
    super(props, id);
    this.description = this.props.description;
    this.is_active = this.props.is_active;
    this.props.created_at = this.props.created_at ?? new Date();
  }

  // get entity_id(): ValueObject {
  //   return this.category_id;
  // }

  // update(name: string, description: string) {
  //   Category.validate({ name, description });
  //   this.name = name;
  //   this.description = description;
  // }

  // static validate(props: Omit<CategoryProperties, 'created_at'>) {
  //   ValidatorRules.values(props.name, 'name').required().string().maxLength(255);
  //   ValidatorRules.values(props.description, 'description').string();
  //   ValidatorRules.values(props.is_active, 'is_active').boolean();
  // }
  // static validate(props: CategoryProperties) {
  //   const validator = CategoryValidatorFactory.create();
  //   const isValid = validator.validate(props);
  //   if (!isValid) {
  //     throw new EntityValidationError(validator.errors);
  //   }
  // }

  changeName(name: string): void {
    this.name = name;
    this.validate(['name']);
  }

  changeDescription(description: string | null): void {
    this.description = description;
  }

  activate() {
    this.props.is_active = true;
  }

  deactivate() {
    this.props.is_active = false;
  }

  get name() {
    return this.props.name;
  }

  private set name(value: string) {
    this.props.name = value
  }

  get description() {
    return this.props.description;
  }

  private set description(value: string) {
    this.props.description = value ?? null;
  }

  get is_active() {
    return this.props.is_active;
  }

  private set is_active(value: boolean) {
    this.props.is_active = value ?? true;
  }

  get created_at() {
    return this.props.created_at;
  }

  validate(fields?: string[]) {
    const validator = CategoryValidatorFactory.create();
    return validator.validate(this.notification, this, fields);
  }

  static fake() {
    return CategoryFakeBuilder;
  }

  toJSON(): CategoryPropsJson {
    return {
      id: this.id.toString(),
      name: this.name,
      description: this.description,
      is_active: this.is_active,
      created_at: this.created_at
    };
  }
}