import { regularExps } from "../../../config/regular-exp";
import { hashPasswords } from "../../../config/bcrypt";
import { Role } from "../../entities/user.entity";

export class RegisterUserDTO {
  private constructor(
    public readonly name: string,
    public readonly email: string,
    public readonly password: string,
    public readonly role?: Role
  ) {}

  static create(object: { [key: string]: any }): [string?, RegisterUserDTO?] {
    const { name, email, password, role } = object;

    if (!name) return ["Missing name"];
    if (!email) return ["Missing email"];
    if (!regularExps.email.test(email)) return ["Email isn't valid"];
    if (!password) return ["Missing password"];
    if (password.toString().length < 6) return ["Password to short"];
    if (role) {
      if (role !== "ADMIN" || role !== "USER") return ["Role isn't valid"];
    }

    const passwordHashed = hashPasswords(password.toString());
    return [undefined, new RegisterUserDTO(name, email, passwordHashed, role)];
  }
}
