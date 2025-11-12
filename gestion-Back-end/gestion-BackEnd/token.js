import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const SECRET = process.env.SECRET;

export function generateToken(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: "1h" });
}
