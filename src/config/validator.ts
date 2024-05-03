import { isValidObjectId } from "mongoose";

export const isMongoID = (id: string) => {
  return isValidObjectId(id);
};
