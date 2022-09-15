import { UniqueEntityId } from "../value-objects/unique-entity-id.vo";

export class Entity<Props>{
  readonly uniqueEntityId: UniqueEntityId;

  constructor(
    readonly props: Props,
    id?: UniqueEntityId
  ) {
    this.uniqueEntityId = id || new UniqueEntityId();
  }

  get id() {
    return this.uniqueEntityId.value;
  }

  toJSON(): Required<{ id: string } & Props> {
    return {
      id: this.id,
      ...this.props
    } as Required<{ id: string } & Props>;
  }
}