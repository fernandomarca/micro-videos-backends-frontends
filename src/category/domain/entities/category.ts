export class Category {
  constructor(
    private _name: string
  ) { }

  changeName(name: string) {
    this._name = name;
  }
  get name(): string {
    return this._name;
  }
}