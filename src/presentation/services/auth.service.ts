import { userModel } from "../../data/mongo/models/user.model";
import { RegisterUserDTO } from "../../domain/dtos/auth/register-user.dto";
import { CustomError } from "../../domain/errors/custom.error";
import "dotenv/config";
import { UserEntity } from "../../domain/entities/user.entity";
import { LoginUserDto } from "../../domain/dtos/auth/login-user.dto";
import { validatePasswords } from "../../config/bcrypt";
import { generateJWT } from "../../config/jwt";

export class AuthService {
  constructor() {}
  public async registerUser(registerUserDto: RegisterUserDTO) {
    const existUser = await userModel.findOne({
      email: registerUserDto.email,
    });

    if (existUser) throw CustomError.badRequest("Email already exist");

    try {
      const createUser = await userModel.create(registerUserDto);
      await createUser.save();

      const { password, ...rest } = UserEntity.fromObject(createUser);

      return { ...rest };
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  public async loginUser(loginUserDto: LoginUserDto) {
    try {
      const user = await userModel.findOne({
        email: loginUserDto.email,
      });

      if (!user)
        throw CustomError.notFound("User doesn't exists with that email");

      const validateWithDB = validatePasswords(
        user.password,
        loginUserDto.password
      );

      if (!validateWithDB) throw CustomError.badRequest("Password incorrect");

      const { password, ...rest } = UserEntity.fromObject(user);

      const token = await generateJWT({ id: user.id }, "6h");
      if (!token) throw CustomError.internalServer("Error creating JWT");

      return { user: rest, msg: "Login done", token };
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }
}
