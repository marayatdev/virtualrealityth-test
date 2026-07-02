import { Router } from "express";
import { AuthController } from "@/controllers/auth.controller";
import { authMiddleware } from "@/middlewares/authMiddleware";
import { validate } from "@/middlewares/validate";
import { loginSchema, registerSchema } from "@/schema/auth";

const router = Router();
const authController = new AuthController();

router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);
router.post("/logout", authController.logout);

router.get("/me", authMiddleware, authController.me);

export default router;
