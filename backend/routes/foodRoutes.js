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

router.get("/query", searchFoodByquery);
router.get("/picker", getFoodPicker);
router.post("/create-meal", multerUpload.single("image"), createMeal);
router.put("/update-meal/:id", multerUpload.single("image"), updateFoodOption);
router.get("/", getALLFoods);
router.get("/:id", getFoodById);
// router.post("/login", signin);

export default router;
