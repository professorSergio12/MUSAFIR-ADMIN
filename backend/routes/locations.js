import express from "express";
import { userAuth } from "../middleware/auth.js";
import {
  createItenerary,
  getAllItenerary,
  getIteneraryById,
  searchItnieraryByquery,
  updateItinerary,
  getItineraryPicker,
} from "../controllers/ItenerayController.js";
import multerUpload from "../middleware/imageUpload.js";

const router = express.Router();

router.post(
  "/create-itenerary",
  multerUpload.single("locationImage"),
  createItenerary
);
router.put("/update-itenerary/:id", multerUpload.single("locationImage"), updateItinerary);
router.get("/", getAllItenerary);
router.get("/query", searchItnieraryByquery);
router.get("/picker", getItineraryPicker);
router.get("/:id", getIteneraryById);

export default router;
