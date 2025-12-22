import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../prisma";

import * as z from "zod"; 
 
const LoginSchema = z.object({ 
  email: z.string(),
  password: z.string()
});

const router = Router();

// POST /auth/login
router.post("/login", async (req, res) => {
    console.log("JWT_SECRET:", process.env.JWT_SECRET);

  const { email, password } = LoginSchema.parse(req.body);

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);

  if (!isValid) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" }
  );

  res.json({ token });
});


export default router;
