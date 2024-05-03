import mongoose from "mongoose";

export class MongoDB {
  static async connection() {
    await mongoose
      .connect(process.env.MONGO_URL as string)
      .then(() => console.log(`MongoDB connected`))
      .catch((error) => console.log(error));
  }
}
