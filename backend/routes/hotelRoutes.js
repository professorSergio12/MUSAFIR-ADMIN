import express from "express";
import { userAuth } from "../middleware/auth.js";
import {
  createHotel,
  getAllHotel,
  getHotelById,
  searchHotelByquery,
  updateHotel,
  getHotelPicker,
} from "../controllers/hotelController.js";
import multerUpload from "../middleware/imageUpload.js";

const router = express.Router();

// All hotel routes require admin authentication
router.get("/query", userAuth, searchHotelByquery);
router.get("/picker", userAuth, getHotelPicker);
router.post(
  "/create-hotel",
  userAuth,
  multerUpload.array("image"),
  createHotel
);
router.get("/", userAuth, getAllHotel);
router.get("/:id", userAuth, getHotelById);
router.put("/update-hotel/:id", userAuth, multerUpload.array("files"), updateHotel);

export default router;
