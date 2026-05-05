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

// All itinerary routes require admin authentication
router.post(
  "/create-itenerary",
  userAuth,
  multerUpload.single("locationImage"),
  createItenerary
);
router.put("/update-itenerary/:id", userAuth, multerUpload.single("locationImage"), updateItinerary);
router.get("/", userAuth, getAllItenerary);
router.get("/query", userAuth, searchItnieraryByquery);
router.get("/picker", userAuth, getItineraryPicker);
router.get("/:id", userAuth, getIteneraryById);

export default router;
