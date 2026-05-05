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

// All dashboard routes require admin authentication
router.get("/summary", userAuth, getSummary);
router.get("/recentBookings", userAuth, getRecentBookings);
router.get("/recentReviews", userAuth, getRecentReiviews);
router.get("/getTopPackages", userAuth, getTopPackages);
router.get("/globalSearch", userAuth, globalSearch);
router.get("/monthly-stats", userAuth, getMonthlyRevenue);

export default router;
