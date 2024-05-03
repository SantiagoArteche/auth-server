import { Router } from "express";
import { AuthController } from "./controller";
import { AuthService } from "../services/auth.service";

export class AuthRoutes {
  static get routes() {
    const router = Router();

    const authService = new AuthService();
    const controller = new AuthController(authService);

    router.post("/login", controller.loginUser);
    router.post("/register", controller.registerUser);

    router.get("/validation-email/:token", controller.validateEmail);

    return router;
  }
}
