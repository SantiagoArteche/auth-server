export class LoginUserDTO {
  constructor(
    public readonly email: string,
    public readonly password: string
  ) {}

  static create(object: { [key: string]: any }): [string?, LoginUserDTO?] {
    const { email, password } = object;

    if (!email) return ["Email is required"];
    if (!password) return ["Password is required"];

    return [undefined, new LoginUserDTO(email, password)];
  }
}
