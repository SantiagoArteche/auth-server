import { Request, Response } from "express";

export class AuthController {
  constructor() {}

  loginUser = async (req: Request, res: Response) => {
    res.send("Login User");
  };

  registerUser = async (req: Request, res: Response) => {
    res.send("Register User");
  };

  validateEmail = async (req: Request, res: Response) => {
    res.send("Validate User");
  };
}
