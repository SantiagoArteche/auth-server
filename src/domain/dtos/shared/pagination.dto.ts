export class PaginationDTO {
  private constructor(
    public readonly page: number,
    public readonly limit: number
  ) {}
  static create(
    page: number = 1,
    limit: number = 10
  ): [string?, PaginationDTO?] {
    if (isNaN(page) || isNaN(limit))
      return ["Page and Limit must be a numbers"];

    if (page <= 0 || limit <= 0)
      return ["Page and limit must be greater than 0"];

    return [undefined, new PaginationDTO(page, limit)];
  }
}
