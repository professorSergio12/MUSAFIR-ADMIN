import express from "express";
import { userAuth } from "../middleware/auth.js";
import {
  getAllboooking,
  getBookingsById,
  getRevenueByMonth,
} from "../controllers/BookingController.js";

const router = express.Router();

router.get("/revenue", getRevenueByMonth);
router.get("/", getAllboooking);
router.get("/:id", getBookingsById);
// router.get("/get-top-package", getTopPackages);
// router.post("/login", signin);

export default router;
