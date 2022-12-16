import { instanceToPlain } from "class-transformer";
import { CategoryPresenter } from "./category.presenter";

describe('CategoryPresenter Unit Tests', () => {
  describe('constructor', () => {
    it('should set values', () => {
      const created_at = new Date();
      const presenter = new CategoryPresenter({
        id: '767d4814-451e-46fe-88e7-511adc91f40e',
        name: 'Movie',
        description: 'some description',
        is_active: true,
        created_at
      });

      expect(presenter.id).toBe('767d4814-451e-46fe-88e7-511adc91f40e');
      expect(presenter.name).toBe('Movie');
      expect(presenter.description).toBe('some description');
      expect(presenter.is_active).toBe(true);
      expect(presenter.created_at).toBe(created_at);
    });
  });

  it('should presenter data', () => {
    const created_at = new Date();
    const presenter = new CategoryPresenter({
      id: '767d4814-451e-46fe-88e7-511adc91f40e',
      name: 'Movie',
      description: 'some description',
      is_active: true,
      created_at
    });
    const data = instanceToPlain(presenter);
    expect(data).toStrictEqual({
      id: '767d4814-451e-46fe-88e7-511adc91f40e',
      name: 'Movie',
      description: 'some description',
      is_active: true,
      created_at: created_at.toISOString()
    });
  });
});