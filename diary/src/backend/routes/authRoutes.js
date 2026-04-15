import express from "express";
import authController from "../controllers/authController.js";

const router = express.Router();


router.post("/login", (req, res) => authController.login(req, res));

router.post("/register", (req, res) => authController.register(req, res));

router.get("/check-username/:username", (req, res) => authController.checkUsername(req, res));

router.post("/verify-token", (req, res) => authController.verifyToken(req, res));

export default router;
