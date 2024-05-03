import { Request, Response } from "express";
import { PaginationDTO } from "../../domain/dtos/shared/pagination.dto";
import { CreateProductDTO } from "../../domain/dtos/product/create-product.dto";
import { ProductService } from "../services/product.service";
import { CustomError } from "../../domain/errors/custom.error";

export class ProductController {
  constructor(private readonly productService: ProductService) {}
  private handleError(error: unknown, res: Response) {
    if (error instanceof CustomError)
      return res.status(error.statusCode).send(error.message);

    return res.status(500).send(`Internal server error`);
  }

  createProduct = (req: Request, res: Response) => {
    const [error, createProductDto] = CreateProductDTO.create({
      ...req.body,
      user: req.body.user.id,
    });
    if (error) return res.status(400).send(error);

    this.productService
      .createProduct(createProductDto!)
      .then((prod) => res.status(201).send(prod))
      .catch((error) => this.handleError(error, res));
  };

  getProducts = (req: Request, res: Response) => {
    const { limit = 10, page = 1 } = req.query;

    const [error, paginationDto] = PaginationDTO.create(+page, +limit);
    if (error) return res.status(400).send(error);

    this.productService
      .getProducts(paginationDto!)
      .then((prod) => res.send(prod))
      .catch((error) => this.handleError(error, res));
  };
}
