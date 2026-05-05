import express from "express";
import {
  createPackage,
  getAllPackage,
  getPackageById,
} from "../controllers/PackageController.js";
import { userAuth } from "../middleware/auth.js";
import multerUpload from "../middleware/imageUpload.js";

const router = express.Router();

// All package routes require admin authentication
router.post("/create-package", userAuth, multerUpload.single("image"), createPackage);
router.get("/", userAuth, getAllPackage);
router.get("/:id", userAuth, getPackageById);

export default router;
