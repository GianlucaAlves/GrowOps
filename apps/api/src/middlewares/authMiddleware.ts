import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma";

type TokenPayload = {
  userId: string;
};

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.slice(7)
      : undefined;

    if (!token) {
      return res.status(401).json({ message: "Não autenticado" });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return res.status(500).json({ message: "JWT_SECRET não configurado" });
    }

    const decoded = jwt.verify(token, secret) as TokenPayload;
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      return res.status(401).json({ message: "Usuário inválido" });
    }

    req.user = user;
    return next();
  } catch {
    return res.status(401).json({ message: "Token inválido ou expirado" });
  }
}
