import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

export async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

export async function comparePassword(password, hashed) {
  return await bcrypt.compare(password, hashed);
}

export function createJWT(user) {
  return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
}

export function generateToken() {
  return crypto.randomBytes(32).toString("hex");
}
