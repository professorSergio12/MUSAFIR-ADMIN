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

router.get("/query", searchHotelByquery);
router.get("/picker", getHotelPicker);
router.post(
  "/create-hotel",
  multerUpload.array("image"),
  createHotel
);
router.get("/", getAllHotel);
router.get("/:id", getHotelById);
router.put("/update-hotel/:id", multerUpload.array("files"), updateHotel);
// router.post("/login", signin);

export default router;
