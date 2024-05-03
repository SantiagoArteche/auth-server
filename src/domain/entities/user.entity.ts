import { CustomError } from "../errors/custom.error";

export interface Role {
  role: "USER" | "ADMIN";
}

export class UserEntity {
  constructor(
    public id: string,
    public readonly name: string,
    public readonly email: string,
    public readonly emailValidated: boolean,
    public readonly password: string,
    public readonly img: string,
    public readonly role: Role[]
  ) {}

  static fromObject(object: { [key: string]: any }): UserEntity {
    const { id, _id, name, email, emailValidated, password, img, role } =
      object;

    if (!id && !_id) {
      throw CustomError.badRequest("Missing id");
    }

    if (!name) {
      throw CustomError.badRequest("Missing name");
    }
    if (!email) {
      throw CustomError.badRequest("Missing email");
    }
    if (!password) {
      throw CustomError.badRequest("Missing password");
    }
    if (!role) {
      throw CustomError.badRequest("Missing role");
    }
    if (emailValidated === undefined) {
      throw CustomError.badRequest("Missing emailValidated");
    }

    return new UserEntity(
      _id || id,
      name,
      email,
      emailValidated,
      password,
      img,
      role
    );
  }
}
