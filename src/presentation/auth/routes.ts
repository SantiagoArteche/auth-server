import { Router } from "express";
import { AuthController } from "./controller";
import { AuthService } from "../services/auth.service";
import { EmailService } from "../../config/nodemailer";

export class AuthRoutes {
  static get routes() {
    const router = Router();

    const emailService = new EmailService(
      process.env.MAIL_SERVICE!,
      process.env.MAIL_USER!,
      process.env.MAILER_SECRET_KEY!
    );
    const authService = new AuthService(emailService);
    const controller = new AuthController(authService);

    router.post("/login", controller.loginUser);
    router.post("/register", controller.registerUser);

    router.get("/validate-email/:token", controller.validateEmail);

    return router;
  }
}
