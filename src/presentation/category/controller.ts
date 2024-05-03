import { Request, Response } from "express";
import { CustomError } from "../../domain/errors/custom.error";
import { CreateCategoryDTO } from "../../domain/dtos/category/create-category.dto";
import { CategoryService } from "../services/category.service";
import { PaginationDTO } from "../../domain/dtos/shared/pagination.dto";

export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  private handleError(error: unknown, res: Response) {
    if (error instanceof CustomError)
      return res.status(error.statusCode).send(error.message);

    return res.status(500).send(`Internal server error`);
  }

  createCategory = async (req: Request, res: Response) => {
    const [error, createCatDto] = CreateCategoryDTO.create(req.body);
    if (error) return res.status(400).send(error);

    this.categoryService
      .createCategory(createCatDto!, req.body.user)
      .then((category) => res.send(category))
      .catch((error) => this.handleError(error, res));
  };

  getCategories = async (req: Request, res: Response) => {
    const { page = 1, limit = 10 } = req.query;
    const [error, paginationDto] = PaginationDTO.create(+page, +limit);
    if (error) return res.status(400).send({ error });

    this.categoryService
      .getCategories(paginationDto!)
      .then((category) => res.send(category))
      .catch((error) => this.handleError(error, res));
  };
}
