import { productModel } from "../../data/mongo/models/product.model";
import { CreateProductDTO } from "../../domain/dtos/product/create-product.dto";
import { PaginationDTO } from "../../domain/dtos/shared/pagination.dto";
import { CustomError } from "../../domain/errors/custom.error";

export class ProductService {
  async createProduct(createProductoDto: CreateProductDTO) {
    try {
      const existProduct = await productModel.findOne({
        name: createProductoDto.name,
      });

      if (existProduct) throw CustomError.badRequest("Product already exist");

      const newProduct = await productModel.create(createProductoDto);
      await newProduct.save();

      return newProduct;
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  async getProducts(pagination: PaginationDTO) {
    const { page, limit } = pagination;
    const [products, total] = await Promise.all([
      await productModel
        .find()
        .skip((page - 1) * limit)
        .limit(limit)
        .populate("category", "name")
        .populate("user", "name"),
      await productModel.countDocuments(),
    ]);

    return {
      page,
      limit,

      next: `/api/products?page=${page + 1}&limit=${limit}`,
      prev:
        page - 1 > 0 ? `/api/products?page=${page - 1}&limit=${limit}` : null,
      total,
      products,
    };
  }
}
