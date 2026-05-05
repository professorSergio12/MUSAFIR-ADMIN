import express from "express";
import { registerUser } from "../controllers/userController.js";

const router = express.Router();

// Only keeping register route if needed
// Login/Logout logic is handled by Musafir backend at /api/auth/signin and /api/auth/logout
router.post("/register", registerUser);

export default router;
