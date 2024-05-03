import { NextFunction, Request, Response } from "express";
import { validateToken } from "../../config/jwt";
import { userModel } from "../../data/mongo/models/user.model";
import { UserEntity } from "../../domain/entities/user.entity";

export class AuthMiddleware {
  constructor() {}

  static async validateJWT(req: Request, res: Response, next: NextFunction) {
    const authorization = req.header("Authorization");
    if (!authorization)
      return res.status(401).send({ error: "Token Not Provided" });

    if (!authorization.startsWith("Bearer"))
      return res.status(401).send("Invalid Bearer Token");

    const token = authorization.split(" ")[1] || "";

    try {
      const payload = await validateToken<{ id: string }>(token);
      if (!payload) return res.status(401).send({ error: "Invalid token" });

      const user = await userModel.findById(payload.id);
      if (!user) return res.status(500).send({ error: "Invalid token - User" });

      req.body.user = UserEntity.fromObject(user);

      next();
    } catch (error) {
      console.log(error);
      res.status(500).send({ error: "Internal server error" });
    }
  }
}
