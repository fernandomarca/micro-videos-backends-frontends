import { Chance } from "chance";
import { Category } from "./category";

type PropOrFactory<T> = T | ((index: number) => T);
type TBuild = Category | Category[];
//CategoryTestDataBuilder{}
export class CategoryFakeBuilder<TBuild> {
  #chance: Chance.Chance;
  #name: PropOrFactory<string> = (_index) => this.#chance.word();
  #description: PropOrFactory<string | null> = (_index) => this.#chance.paragraph();
  #is_active: PropOrFactory<boolean> = (_index) => true;
  #countObjs: number;

  constructor(countObjs: number = 1) {
    this.#countObjs = countObjs;
    this.#chance = Chance();
  }

  static aCategory() {
    return new CategoryFakeBuilder<Category>();
  }

  static theCategories() {
    return new CategoryFakeBuilder<Category[]>();
  }

  static aMovie() {
    return new CategoryFakeBuilder().withName('Movie');
  }

  //fluent pattern
  withName(name: PropOrFactory<string>) {
    this.#name = name;
    return this;
  }

  withDescription(description: PropOrFactory<string | null>) {
    this.#description = description;
    return this;
  }

  activate() {
    this.#is_active = true;
    return this;
  }

  deactivate() {
    this.#is_active = false;
    return this;
  }

  build(): TBuild {
    const categories = new Array(this.#countObjs).fill(undefined)
      .map((_, index) => (
        new Category({
          name: this.callFactory(this.#name, index),
          description: this.callFactory(this.#description, index),
          is_active: this.callFactory(this.#is_active, index),
        })
      ));
    return categories.length === 1 ? categories[0] as any : categories;
  }

  private callFactory(factoryOrValue: PropOrFactory<any>, index: number) {
    return typeof factoryOrValue === "function" ? factoryOrValue(index) :
      factoryOrValue;
  }
}

// const cat = CategoryFakeBuilder.aCategory().withName('Movie').build()