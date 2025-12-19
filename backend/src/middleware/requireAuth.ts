import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Middleware to protect private routes
export function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  // Check if Authorization header exists
  if (!authHeader) {
    return res.status(401).json({ message: "Missing authorization header" });
  }

  // Expected format: "Bearer TOKEN"
  const [type, token] = authHeader.split(" ");

  if (type !== "Bearer" || !token) {
    return res.status(401).json({ message: "Invalid authorization format" });
  }

  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as { userId: number };

    // Attach user info to the request (very important)
    req.user = { id: payload.userId };

    next(); // ✅ allow request to continue
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
