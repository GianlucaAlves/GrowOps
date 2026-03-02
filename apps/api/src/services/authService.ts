import jwt from "jsonwebtoken";
import { hashPassword, comparePassword } from "../lib/hash";
import { findUserByEmail, createUser } from "../repositories/userRepository";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function registerUser(
  email: string,
  password: string,
  name: string,
) {
  const existing = await findUserByEmail(email);
  if (existing) throw new Error("Email already registered");
  const hashed = await hashPassword(password);
  return createUser({ email, passwordHash: hashed, name });
}

export async function loginUser(email: string, password: string) {
  const user = await findUserByEmail(email);
  if (!user) throw new Error("Invalid credentials");
  const valid = await comparePassword(password, user.passwordHash);
  if (!valid) throw new Error("Invalid credentials");
  return user;
}

export function generateAccessToken(userId: string) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "15m" });
}

export function generateRefreshToken(userId: string) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });
}
