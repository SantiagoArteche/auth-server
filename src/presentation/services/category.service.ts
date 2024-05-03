import { categoryModel } from "../../data/mongo/models/category.model";
import { CreateCategoryDTO } from "../../domain/dtos/category/create-category.dto";
import { PaginationDTO } from "../../domain/dtos/shared/pagination.dto";
import { UserEntity } from "../../domain/entities/user.entity";
import { CustomError } from "../../domain/errors/custom.error";
export class CategoryService {
  constructor() {}

  public async createCategory(
    categoryDTO: CreateCategoryDTO,
    user: UserEntity
  ) {
    const categoryExists = await categoryModel.findOne({
      name: categoryDTO.name,
    });

    if (categoryExists) throw CustomError.badRequest("Category already exist");

    try {
      const newCategory = await categoryModel.create({
        user: user.id,
        ...categoryDTO,
      });
      await newCategory.save();

      return newCategory;
    } catch (error) {
      throw CustomError.internalServer(`Internal Server Error`);
    }
  }

  public async getCategories(pagination: PaginationDTO) {
    const { limit, page } = pagination;
    try {
      const [categories, total] = await Promise.all([
        await categoryModel
          .find()
          .skip((page - 1) * limit)
          .limit(limit),
        await categoryModel.countDocuments(),
      ]);

      return {
        limit,
        page,
        next: `/api/categories?page=${page + 1}&limit=${limit}`,
        prev:
          page - 1 > 0
            ? `/api/categories?page=${page - 1}&limit=${limit}`
            : null,

        total,
        categories,
      };
    } catch (error) {
      throw CustomError.internalServer(`Internal Server Error`);
    }
  }
}
