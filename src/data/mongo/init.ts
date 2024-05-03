import mongoose from "mongoose";

export class MongoDB {
  static connection() {
    mongoose
      .connect(process.env.MONGO_URL as string, { dbName: "authMongo" })
      .then(() => console.log(`MongoDB connected`))
      .catch((error) => console.log(error));
  }
}
