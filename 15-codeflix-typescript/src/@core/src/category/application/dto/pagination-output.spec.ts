import { SearchResult } from "../../../@seedwork/domain/repository/repository-contracts";
import { PaginationOutputMapper } from "./pagination-output.dto";

describe("PaginationOutputMapper Unit test", () => {
  it("should convert a SearchResult in output", () => {
    const result = new SearchResult({
      items: ["fake"] as any,
      total: 1,
      current_page: 1,
      per_page: 1,
      sort: 'name',
      sort_dir: "desc",
      filter: "fake"
    });
    const spyToOutput = jest.spyOn(PaginationOutputMapper, 'toOutput');

    const output = PaginationOutputMapper.toOutput(
      {
        items: result.items,
        ...result
      }
    );
    expect(spyToOutput).toHaveBeenCalled();
    expect(output).toStrictEqual({
      total: 1,
      current_page: 1,
      per_page: 1,
      last_page: 1
    });
  });
});