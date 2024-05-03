import { userModel } from "../../data/mongo/models/user.model";
import { RegisterUserDTO } from "../../domain/dtos/auth/register-user.dto";
import { CustomError } from "../../domain/errors/custom.error";
import "dotenv/config";
import { UserEntity } from "../../domain/entities/user.entity";
import { LoginUserDto } from "../../domain/dtos/auth/login-user.dto";
import { validatePasswords } from "../../config/bcrypt";
import { generateJWT, validateToken } from "../../config/jwt";
import { EmailService } from "../../config/nodemailer";

export class AuthService {
  constructor(private readonly emailService: EmailService) {}
  public async registerUser(registerUserDto: RegisterUserDTO) {
    const existUser = await userModel.findOne({
      email: registerUserDto.email,
    });

    if (existUser) throw CustomError.badRequest("Email already exist");

    try {
      const createUser = await userModel.create(registerUserDto);
      await createUser.save();

      this.sendEmailValidationLink(createUser.email);

      const { password, ...rest } = UserEntity.fromObject(createUser);

      const token = await generateJWT({ id: createUser.id }, "6h");
      if (!token) throw CustomError.internalServer("Error creating JWT");

      return { ...rest, token };
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

  private sendEmailValidationLink = async (email: string): Promise<boolean> => {
    const token = await generateJWT({ email });
    if (!token) throw CustomError.internalServer("Error getting token");

    const link = `${process.env.MAIL_SERVICE_URL}/auth/validate-email/${token}`;
    const html = `<h1> Validate Your Email </h1>
                <p>Click the next link to validate your email!</p>
                <a href="${link}">Validate your email: ${email}</a>
                `;

    const options = {
      to: email,
      subject: "Validate your email",
      htmlBody: html,
    };

    const isSend = await this.emailService.sendEmail(options);
    if (!isSend) throw CustomError.internalServer("Error sending email");

    return true;
  };

  public async validateEmail(token: string) {
    const payload = await validateToken(token);
    if (!payload) throw CustomError.unauthorized("Invalid Token");

    const { email } = payload as { email: string };

    if (!email) throw CustomError.internalServer("Email not in token");

    const user = await userModel.findOne({ email });

    if (!user) throw CustomError.internalServer("Email not exists");

    const updateValidateEmail = await userModel.findByIdAndUpdate(user._id, {
      emailValidated: true,
    });

    await updateValidateEmail?.save();

    return "Email validated!";
  }
}
