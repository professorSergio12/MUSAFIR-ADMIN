import express from "express";
import { userAuth } from "../middleware/auth.js";
import {
  getMonthlyRevenue,
  getRecentBookings,
  getRecentReiviews,
  getSummary,
  getTopPackages,
} from "../controllers/dashboard.js";
import { globalSearch } from "../controllers/globalSearch.js";
const router = express.Router();

router.get("/summary", getSummary);
router.get("/recentBookings", getRecentBookings);
router.get("/recentReviews", getRecentReiviews);
router.get("/getTopPackages", getTopPackages);
router.get("/globalSearch", globalSearch);
router.get("/monthly-stats", getMonthlyRevenue);

export default router;
