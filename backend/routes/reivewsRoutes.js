import express from "express"
import { getAllReview, getReviewById, updateReviewComment } from "../controllers/reviewsController.js"

const router = express.Router()

router.get("/", getAllReview)
router.get("/:id", getReviewById)
router.put("/:id/comment", updateReviewComment)

export default router