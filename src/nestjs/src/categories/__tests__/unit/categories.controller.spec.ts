import { CreateCategoryUseCase, ListCategoriesUseCase } from '@fm/micro-videos/category/application';
import { SortDirection } from '@fm/micro-videos/dist/@seedwork/domain/repository/repository-contracts';
import { CategoriesController } from '../../categories.controller';
import { CreateCategoryDto } from '../../dto/create-category.dto';

describe('CategoriesController Unit TEsts', () => {
  let controller: CategoriesController;

  beforeEach(async () => {
    controller = new CategoriesController();
  });

  it('should creates a category', async () => {
    const expectOutput: CreateCategoryUseCase.Output = {
      id: 'uuid-fake',
      name: "Movie",
      description: "some description",
      is_active: true,
      created_at: new Date()
    };
    const MockCreateUseCase = {
      execute: jest.fn().mockResolvedValue(Promise.resolve(expectOutput))
    };
    //@ts-expect-error
    controller['createCategory'] = MockCreateUseCase;
    const input: CreateCategoryDto = {
      name: "Movie",
      description: "some description",
      is_active: true
    };
    const output = await controller.create(input);
    expect(MockCreateUseCase.execute).toBeCalledWith(input);
    expect(output).toStrictEqual(expectOutput);
  });

  it('should updates a category', async () => {
    const expectOutput: CreateCategoryUseCase.Output = {
      id: 'uuid-fake',
      name: "Movie",
      description: "some description",
      is_active: true,
      created_at: new Date()
    };
    const MockUpdateUseCase = {
      execute: jest.fn().mockResolvedValue(Promise.resolve(expectOutput))
    };
    //@ts-expect-error
    controller['updateCategory'] = MockUpdateUseCase;
    const input: CreateCategoryDto = {
      name: "Movie",
      description: "some description",
      is_active: true
    };
    const output = await controller.update('uuid-fake', input);
    expect(MockUpdateUseCase.execute).toBeCalledWith({ id: 'uuid-fake', ...input });
    expect(output).toStrictEqual(expectOutput);
  });

  it('should deletes a category', async () => {
    const expectOutput = undefined;
    const MockDeleteUseCase = {
      execute: jest.fn().mockResolvedValue(Promise.resolve(expectOutput))
    };
    //@ts-expect-error
    controller['deleteCategory'] = MockDeleteUseCase;
    const id = 'uuid-fake';
    // expect(controller.remove(id)).toBeInstanceOf(Promise);
    const output = await controller.remove(id);
    expect(MockDeleteUseCase.execute).toBeCalledWith({ id });
    expect(output).toStrictEqual(expectOutput);
  });

  it('should get a category', async () => {
    const id = 'uuid-fake';
    const expectOutput: CreateCategoryUseCase.Output = {
      id,
      name: "Movie",
      description: "some description",
      is_active: true,
      created_at: new Date()
    };
    const MockGetUseCase = {
      execute: jest.fn().mockResolvedValue(Promise.resolve(expectOutput))
    };
    //@ts-expect-error
    controller['getCategory'] = MockGetUseCase;

    const output = await controller.findOne(id);
    expect(MockGetUseCase.execute).toBeCalledWith({ id });
    expect(output).toStrictEqual(expectOutput);
  });

  it('should list categories', async () => {
    const expectedOutput: ListCategoriesUseCase.Output = {
      items: [
        {
          id: 'uuid-fake',
          name: "Movie",
          description: "some description",
          is_active: true,
          created_at: new Date()
        }
      ],
      current_page: 1,
      last_page: 1,
      per_page: 1,
      total: 1
    };
    const mockListUseCase = {
      execute: jest.fn().mockResolvedValue(Promise.resolve(expectedOutput))
    }
    //@ts-expect-error
    controller['listCategory'] = mockListUseCase;
    const searchParams = {
      page: 1,
      per_page: 2,
      sort: 'name',
      sort_dir: 'desc' as SortDirection,
      filter: 'test'
    };
    const output = await controller.search(searchParams);
    expect(mockListUseCase.execute).toHaveBeenCalled();
    expect(output).toStrictEqual(expectedOutput);
  });
});
