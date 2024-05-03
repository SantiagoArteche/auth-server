export class CreateCategoryDTO {
  constructor(
    public readonly name: string,
    public readonly available?: boolean
  ) {}

  static create(object: { [key: string]: any }): [string?, CreateCategoryDTO?] {
    let { name, available } = object;
    let availableBoolean = available;

    if (!name) return ["Name is required"];
    if (typeof available !== "boolean") availableBoolean = available === "true";
    else return ["Available must be a boolean"];

    return [undefined, new CreateCategoryDTO(name, availableBoolean)];
  }
}
