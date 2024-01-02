import { Notification } from "../validators/notification";
import { UniqueEntityId } from "../value-objects/unique-entity-id.vo";

export abstract class Entity<
  Props = any,
  JsonProps = Required<{ id: string } & Props>
>{
  public readonly uniqueEntityId: UniqueEntityId;

  notification = new Notification();

  constructor(
    readonly props: Props,
    id?: UniqueEntityId
  ) {
    this.uniqueEntityId = id || new UniqueEntityId();
  }

  get id() {
    return this.uniqueEntityId.value;
  }

  abstract toJSON(): JsonProps;
}

export default Entity;
