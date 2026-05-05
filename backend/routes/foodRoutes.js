import express from "express";
import { userAuth } from "../middleware/auth.js";
import {
  createMeal,
  getALLFoods,
  getFoodById,
  searchFoodByquery,
  updateFoodOption,
  getFoodPicker,
} from "../controllers/FoodController.js";
import multerUpload from "../middleware/imageUpload.js";

const router = express.Router();

// All food routes require admin authentication
router.get("/query", userAuth, searchFoodByquery);
router.get("/picker", userAuth, getFoodPicker);
router.post("/create-meal", userAuth, multerUpload.single("image"), createMeal);
router.put("/update-meal/:id", userAuth, multerUpload.single("image"), updateFoodOption);
router.get("/", userAuth, getALLFoods);
router.get("/:id", userAuth, getFoodById);

export default router;
