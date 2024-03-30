import express from "express";
const router = express.Router();
import authController from "../controllers/auth.controller.js";

// POST /auth/signup
router.post("/auth/signup", authController.signup);

// POST /auth/signin
router.post("/auth/signin", authController.signin);

// POST /auth/signout
router.post("/auth/signout", authController.signout);

export default router;
