import express from "express";
import {
  createPackage,
  getAllPackage,
  getPackageById,
} from "../controllers/PackageController.js";
import { userAuth } from "../middleware/auth.js";
import multerUpload from "../middleware/imageUpload.js";

const router = express.Router();

router.post("/create-package", multerUpload.single("image"), createPackage);
router.get("/", getAllPackage);
router.get("/:id", getPackageById);
// router.post("/login", signin);

export default router;
