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

router.get("/", getAllGalleryImages);
router.post(
  "/upload",
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
