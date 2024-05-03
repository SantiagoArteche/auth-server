import { isMongoID } from "../../../config/validator";

export class CreateProductDTO {
  private constructor(
    public name: string,
    public price: string,
    public user: string,
    public category: string,
    public available?: boolean
  ) {}

  static create(object: { [key: string]: any }): [string?, CreateProductDTO?] {
    const { name, price = 0, user, category, available } = object;
    let isAvailable = available;

    if (!name) return ["Missing name"];
    if (!category) return ["Missing category"];
    if (!user) return ["Missing user"];
    if (!isMongoID(user)) return ["Invalid User ID"];
    if (!isMongoID(category)) return ["Invalid Category ID"];

    if (typeof available !== "boolean") isAvailable = available === "true";
    else return ["Available must be a boolean"];

    return [
      undefined,
      new CreateProductDTO(name, price, user, category, isAvailable),
    ];
  }
}
