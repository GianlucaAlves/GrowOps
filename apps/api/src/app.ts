import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./routes/auth";
import taskRouter from "./routes/tasks";
import gardenRouter from "./routes/gardens";
import plantRouter from "./routes/plants";
import eventRouter from "./routes/events";
import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
  }),
);

app.get("/api/v1/health", (_req: Request, res: Response) => {
  res.json({ status: "ok" });
});

app.use("/api/v1/auth", router);
app.use("/api/auth", router);

app.use("/api/v1/tasks", taskRouter);
app.use("/api/v1/gardens", gardenRouter);
app.use("/api/v1/plants", plantRouter);
app.use("/api/v1/events", eventRouter);

app.use((req: Request, res: Response) => {
  if (req.path.startsWith("/api/")) {
    return res.status(404).json({ message: "Route not found" });
  }
  return res.status(404).send("Not Found");
});

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof ZodError) {
    return res
      .status(422)
      .json({ message: "Validation failed", issues: err.issues });
  }

  if (err instanceof Error) {
    if (err.message === "Email already registered") {
      return res.status(409).json({ message: err.message });
    }

    if (err.message === "Invalid credentials") {
      return res.status(401).json({ message: err.message });
    }

    return res.status(500).json({ message: err.message });
  }

  return res.status(500).json({ message: "Internal server error" });
});

export default app;
