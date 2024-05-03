import { Router } from "express";
import { CategoryController } from "./controller";
import { CategoryService } from "../services/category.service";
import { AuthMiddleware } from "../middlewares/auth.middleware";

export class CategoryRoutes {
  static get routes() {
    const router = Router();

    const CatService = new CategoryService();
    const controller = new CategoryController(CatService);

    router.get("/", controller.getCategories);
    router.post("/", AuthMiddleware.validateJWT, controller.createCategory);

    return router;
  }
}
