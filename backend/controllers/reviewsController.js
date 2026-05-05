import { errorHandler } from "../util/error.js";
import packageReviews from "../models/packageReviews.model.js";
import mongoose from "mongoose";

export const getAllReview = async (req, res, next) => {
  try {
    const limit = 10;
    const page = Number(req.query.page || 1);
    const skip = (page - 1) * limit;
    const q = (req.query.q || "").toString().trim();

    const pipeline = [
      {
        $lookup: {
          from: "packages",
          localField: "package",
          foreignField: "_id",
          as: "package",
        },
      },

      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },

      { $unwind: "$package" },
      { $unwind: "$user" },

      ...(q
        ? [
            {
              $match: {
                $or: [
                  { title: { $regex: q, $options: "i" } },
                  { review: { $regex: q, $options: "i" } },
                  { "user.username": { $regex: q, $options: "i" } },
                  { "package.name": { $regex: q, $options: "i" } },
                ],
              },
            },
          ]
        : []),

      {
        $project: {
          _id: 1,
          rating: 1,
          title: 1,
          review: 1,
          images: 1,
          helpfulVotes: 1,
          createdAt: 1,

          user: {
            _id: "$user._id",
            username: "$user.username",
          },

          package: {
            _id: "$package._id",
            name: "$package.name",
          },
        },
      },

      { $sort: { createdAt: -1 } },
      {
        $facet: {
          data: [{ $skip: skip }, { $limit: limit }],
          total: [{ $count: "count" }],
        },
      },
    ];

    const result = await packageReviews.aggregate(pipeline);
    const data = result?.[0]?.data || [];
    const totalReviews = result?.[0]?.total?.[0]?.count || 0;

    res.status(200).json({ success: true, data, totalReviews });
  } catch (error) {
    console.log(error);
    next(
      errorHandler(
        500,
        "Internal Server Error: Error in getting all reviews: " + error.message
      )
    );
  }
};

export const getReviewById = async (req, res, next) => {
  try {
    const data = await packageReviews.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(req.params.id),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $lookup: {
          from: "packages",
          localField: "package",
          foreignField: "_id",
          as: "package",
        },
      },
      { $unwind: "$package" },
      {
        $project: {
          _id: 1,
          rating: 1,
          title: 1,
          review: 1,
          comment: 1,
          images: 1,
          helpfulVotes: 1,
          createdAt: 1,
          user: {
            _id: "$user._id",
            username: "$user.username",
            email: "$user.email",
            profilePicture: "$user.profilePicture",
          },
          package: {
            _id: "$package._id",
            name: "$package.name",
            basePrice: "$package.basePrice",
            images: "$package.images",
            country: "$package.country",
          },
        },
      },
    ]);
    res.status(200).json({
      msg: "data fetched successfully",
      data: data,
    });
  } catch (error) {
    next(
      errorHandler(
        500,
        "Internal Server Error : Error in getting review by id : " +
          error.message
      )
    );
  }
};

export const updateReviewComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { comment } = req.body;

    const review = await packageReviews.findByIdAndUpdate(
      id,
      { comment: comment || null },
      { new: true, runValidators: true }
    );

    if (!review) {
      return next(errorHandler(404, "Review not found"));
    }

    res.status(200).json({
      success: true,
      msg: "Comment updated successfully",
      data: review,
    });
  } catch (error) {
    next(
      errorHandler(
        500,
        "Internal Server Error: Error in updating review comment: " +
          error.message
      )
    );
  }
};
