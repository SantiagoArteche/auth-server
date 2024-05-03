import { MongoDB } from "../mongo/init";
import "dotenv/config";
import { userModel } from "../mongo/models/user.model";
import { categoryModel } from "../mongo/models/category.model";
import { productModel } from "../mongo/models/product.model";
import { seedData } from "./data";

(async () => {
  await MongoDB.connection();
  await seed();
  await MongoDB.disconnect();
})();

const randomBetween0x = (x: number) => Math.floor(Math.random() * x);

async function seed() {
  await Promise.all([
    userModel.deleteMany(),
    categoryModel.deleteMany(),
    productModel.deleteMany(),
  ]);

  const users = await userModel.insertMany(seedData.users);

  const categories = await categoryModel.insertMany(
    seedData.categories.map((category) => {
      return {
        ...category,
        user: users[0]._id,
      };
    })
  );

  const products = await productModel.insertMany(
    seedData.products.map((prod) => {
      return {
        ...prod,
        user: users[randomBetween0x(seedData.users.length)]._id,
        category: categories[randomBetween0x(seedData.categories.length)]._id,
      };
    })
  );

  console.log("SEED done");
}
