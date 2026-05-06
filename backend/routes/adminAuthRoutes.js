import express from "express";
import {
  adminSignin,
  adminLogout,
  adminVerify,
} from "../controllers/adminAuthController.js";

const router = express.Router();

router.post("/signin", adminSignin);
router.post("/logout", adminLogout);
router.get("/verify", adminVerify);

export default router;
