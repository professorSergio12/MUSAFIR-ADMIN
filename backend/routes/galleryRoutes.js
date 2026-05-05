import express from "express";
import { userAuth } from "../middleware/auth.js";
import {
  getAllGalleryImages,
  uploadGalleryImage,
  updateGalleryImage,
  deleteGalleryImage,
} from "../controllers/galleryController.js";
import multerUpload from "../middleware/imageUpload.js";

const router = express.Router();

// Admin-only: require auth for all gallery management
router.get("/", userAuth, getAllGalleryImages);
router.post(
  "/upload",
  userAuth,
  multerUpload.single("image"),
  uploadGalleryImage
);
router.put(
  "/update/:id",
  userAuth,
  multerUpload.single("image"),
  updateGalleryImage
);
router.delete("/delete/:id", userAuth, deleteGalleryImage);

export default router;
