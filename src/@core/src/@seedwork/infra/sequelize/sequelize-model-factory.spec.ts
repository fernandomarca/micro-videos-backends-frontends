import { Column, DataType, PrimaryKey, Sequelize, Table, Model } from "sequelize-typescript";
import { SequelizeModelFactory } from "./sequelize-model-factory";
import chance from "chance";
import { validUUID } from "#seedwork/domain";
import { setupSequelize } from "../testing/helpers/db";

@Table({})
class StubModel extends Model {
  @PrimaryKey
  @Column({ type: DataType.UUID })
  declare id;

  @Column({ allowNull: false, type: DataType.STRING(255) })
  declare name;

  static mockFactory = jest.fn(() => ({
    id: chance().guid({ version: 4 }),
    name: chance().word()
  }));

  static factory() {
    return new SequelizeModelFactory(StubModel, StubModel.mockFactory)
  }
}

describe('SequelizeModelFactory Unit Tests', () => {
  setupSequelize({ models: [StubModel] });

  test('create method', async () => {
    let model = await StubModel.factory().create();
    expect(validUUID(model.id)).toBeTruthy();
    expect(model.name).not.toBeNull();
    expect(StubModel.mockFactory).toHaveBeenCalled();

    let modelFound = await StubModel.findByPk(model.id);
    expect(model.id).toBe(modelFound.id);

    model = await StubModel.factory().create({
      id: "767d4814-451e-46fe-88e7-511adc91f40e",
      name: 'test'
    });

    expect(model.id).toBe("767d4814-451e-46fe-88e7-511adc91f40e");
    expect(model.name).toBe('test');
    expect(StubModel.mockFactory).toHaveBeenCalledTimes(1);

    modelFound = await StubModel.findByPk(model.id);
    expect(model.id).toBe(modelFound.id);

  });
});