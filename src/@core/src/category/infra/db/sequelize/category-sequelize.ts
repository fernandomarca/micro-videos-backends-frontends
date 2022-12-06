import { SequelizeModelFactory } from "#seedwork/infra/sequelize/sequelize-model-factory";
import { Column, DataType, PrimaryKey, Table, Model } from "sequelize-typescript";
import { Category, CategoryRepository } from "#category/domain";
import { EntityValidationError, NotFoundError, UniqueEntityId } from "#seedwork/domain";
import { Op } from "sequelize";
import { LoadEntityError } from "#seedwork/domain/errors/load-entity.error";

export namespace CategorySequelize {

  type CategoryModelProps = {
    id: string;
    name: string;
    description: string | null;
    is_active: boolean;
    created_at: Date;
  }

  @Table({ tableName: 'categories', timestamps: false })
  export class CategoryModel extends Model<CategoryModelProps> {
    @PrimaryKey
    @Column({ type: DataType.UUID })
    declare id: string;

    @Column({ allowNull: false, type: DataType.STRING(255) })
    declare name: string;

    @Column({ type: DataType.TEXT })
    declare description: string | null;

    @Column({ allowNull: false, type: DataType.BOOLEAN })
    declare is_active: boolean;

    @Column({ allowNull: false, type: DataType.DATE })
    declare created_at: Date;

    static factory() {
      const chance: Chance.Chance = require('chance')();
      return new SequelizeModelFactory<CategoryModel, CategoryModelProps>(CategoryModel, () => ({
        id: chance.guid({ version: 4 }),
        name: chance.word(),
        description: chance.paragraph(),
        is_active: true,
        created_at: chance.date()
      }))
    }
  }

  export class CategorySequelizeRepository implements CategoryRepository.Repository {

    sortableFields: string[] = ['name', 'created_at'];
    constructor(private categoryModel: typeof CategoryModel) {
    }

    async insert(entity: Category): Promise<void> {
      await this.categoryModel.create(entity.toJSON())
    }

    async findById(id: string | UniqueEntityId): Promise<Category> {
      const _id = `${id}`;
      const model = await this._get(_id);
      return CategoryModelMapper.toEntity(model);
    }

    async findAll(): Promise<Category[]> {
      const models = await this.categoryModel.findAll();
      return models.map((m) => CategoryModelMapper.toEntity(m));
    }

    async update(entity: Category): Promise<void> { }
    async delete(id: string | UniqueEntityId): Promise<void> { }

    private async _get(id: string): Promise<CategoryModel> {
      return this.categoryModel.findByPk(id, { rejectOnEmpty: new NotFoundError(`Entity Not Found using ID ${id}`) });
    }

    async search(props: CategoryRepository.SearchParams): Promise<CategoryRepository.SearchResult> {
      const offset = (props.page - 1) * props.per_page;//15
      const limit = props.per_page;//15
      const { rows: models, count } = await this.categoryModel.findAndCountAll({
        ...(props.filter && { where: { name: { [Op.like]: `%${props.filter}%` } } }),
        ...(props.sort && this.sortableFields.includes(props.sort)
          ? { order: [[props.sort, props.sort_dir]] }
          : { order: [['created_at', 'DESC']] }
        ),
        offset,
        limit
      });
      return new CategoryRepository.SearchResult({
        items: models.map((m) => CategoryModelMapper.toEntity(m)),
        current_page: props.page,
        per_page: props.per_page,
        total: count,
        filter: props.filter,
        sort: props.sort,
        sort_dir: props.sort_dir,
      });
    }
  }

  export class CategoryModelMapper {
    static toEntity(model: CategoryModel) {
      const { id, ...rest } = model.toJSON();
      try {
        return new Category(rest, new UniqueEntityId(id));
      } catch (e) {
        if (e instanceof EntityValidationError) {
          throw new LoadEntityError(e.error);
        }
        throw e;
      }
    }
  }
}