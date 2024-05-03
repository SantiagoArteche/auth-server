import bcrypt from "bcrypt";
import "dotenv/config";

export const hashPasswords = (password: string) =>
  bcrypt.hashSync(password, +process.env.SALT!);

export const validatePasswords = (passworDB: string, password: string) =>
  bcrypt.compareSync(password, passworDB);
