import { Request, Response, NextFunction } from "express";
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  // Exemplo: autenticação fake para desenvolvimento
  req.user = {
    id: "dev-user-id",
    email: "dev@user.com",
    name: "Dev",
    passwordHash: "",
    createdAt: new Date(),
    updatedAt: new Date(),
  } as any;
  next();
}
