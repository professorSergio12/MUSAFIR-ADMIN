import express from "express";
import { userAuth } from "../middleware/auth.js";
import {
  getAllboooking,
  getBookingsById,
  getRevenueByMonth,
} from "../controllers/BookingController.js";

const router = express.Router();

// All booking routes require admin authentication
router.get("/revenue", userAuth, getRevenueByMonth);
router.get("/", userAuth, getAllboooking);
router.get("/:id", userAuth, getBookingsById);

export default router;
