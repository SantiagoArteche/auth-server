import jwt from "jsonwebtoken";
import "dotenv/config";

export const generateJWT = (payload: any, duration: string = "2h") => {
  return new Promise((resolve) => {
    jwt.sign(
      payload as any,
      process.env.SEED!,
      { expiresIn: duration },
      (err, token) => {
        if (err) return resolve(null);

        resolve(token);
      }
    );
  });
};

export const validateToken = <T>(token: string): Promise<T | null> => {
  return new Promise((resolve) => {
    jwt.verify(token, process.env.SEED!, (err, decoded) => {
      if (err) return resolve(null);

      resolve(decoded as T);
    });
  });
};
