import { registerSchema, loginSchema } from "../schemas/authSchemas";
import {
  registerUser,
  loginUser,
  generateAccessToken,
  generateRefreshToken,
} from "../services/authService";
import type { Request, Response, NextFunction } from "express";

export async function register(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { email, password, name } = registerSchema.parse(req.body);
    const user = await registerUser(email, password, name);
    res
      .status(201)
      .json({ user: { id: user.id, email: user.email, name: user.name } });
  } catch (err) {
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const user = await loginUser(email, password);
    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.json({
      accessToken,
      user: { id: user.id, email: user.email, name: user.name },
    });
  } catch (err) {
    next(err);
  }
}
