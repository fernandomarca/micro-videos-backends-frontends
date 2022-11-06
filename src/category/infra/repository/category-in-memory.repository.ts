import { InMemorySearchableRepository } from "@seedwork/domain/repository/in-memory.repository";
import { Category } from "category/domain/entities/category";
import { CategoryRepository } from "category/repository/CategoryRepository";

class CategoryInMemoryRepository extends
  InMemorySearchableRepository<Category>
  implements CategoryRepository { }