import express from "express";
import { registerUser, signin } from "../controllers/userController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", signin);

export default router;
