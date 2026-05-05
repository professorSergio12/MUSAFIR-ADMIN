import express from "express"
import { userAuth } from "../middleware/auth.js"
import { getAllReview, getReviewById, updateReviewComment } from "../controllers/reviewsController.js"

const router = express.Router()

// All review routes require admin authentication
router.get("/", userAuth, getAllReview)
router.get("/:id", userAuth, getReviewById)
router.put("/:id/comment", userAuth, updateReviewComment)

export default router