import { Request, Response } from "express";
import { RegisterUserDTO } from "../../domain/dtos/auth/register-user.dto";
import { AuthService } from "../services/auth.service";
import { CustomError } from "../../domain/errors/custom.error";
import { LoginUserDto } from "../../domain/dtos/auth/login-user.dto";

export class AuthController {
  constructor(public readonly authService: AuthService) {}

  private handleError(error: unknown, res: Response) {
    if (error instanceof CustomError)
      return res.status(error.statusCode).send(error.message);

    return res.status(500).send(`Internal server error`);
  }

  public registerUser = async (req: Request, res: Response) => {
    const [error, registerDto] = RegisterUserDTO.create(req.body);
    if (error) return res.status(400).send(error);

    this.authService
      .registerUser(registerDto!)
      .then((user) => res.send(user))
      .catch((error) => this.handleError(error, res));
  };

  public loginUser = async (req: Request, res: Response) => {
    const [error, loginDto] = LoginUserDto.create(req.body);
    if (error) return res.status(400).send(error);

    this.authService
      .loginUser(loginDto!)
      .then((user) => res.send(user))
      .catch((error) => this.handleError(error, res));
  };

  public validateEmail = async (req: Request, res: Response) => {
    res.send("Validate User");
  };
}
