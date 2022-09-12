export type CategoryProperties = {
  name: string;
  description?: string;
  is_active?: boolean;
  created_at?: Date;
}

export class Category {
  constructor(
    readonly props: CategoryProperties
  ) { }

  changeName(name: string) {
    this.props.name = name;
  }
}