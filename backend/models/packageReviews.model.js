import mongoose from "mongoose";

const packageReviewsSchema = new mongoose.Schema(
  {
    // Package reference
    package: {
      type: mongoose.Schema.ObjectId,
      ref: "Package",
      required: true,
      index: true, // For faster queries
    },

    // User reference
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    comment: {
      type: String,
      trim: true,
    },

    // Booking reference (optional - to link review to specific booking)
    booking: {
      type: mongoose.Schema.ObjectId,
      ref: "Booking",
      required: false,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
      validate: {
        validator: Number.isInteger,
        message: "Rating must be an integer",
      },
    },

    title: {
      type: String,
      required: true,
      maxlength: 100,
      trim: true,
    },

    review: {
      type: String,
      required: true,
      maxlength: 1000,
      trim: true,
    },

    images: [
      {
        type: String,
        validate: {
          validator: function (v) {
            return v.startsWith("https://res.cloudinary.com/");
          },
          message: "Images must be valid Cloudinary URLs",
        },
      },
    ],

    helpfulVotes: {
      type: Number,
      default: 0,
      min: 0,
    },

    votedBy: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],

    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
    },

    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for better performance
packageReviewsSchema.index({ package: 1, createdAt: -1 }); // For package reviews sorted by date
packageReviewsSchema.index({ user: 1, createdAt: -1 }); // For user's reviews
packageReviewsSchema.index({ rating: 1 }); // For rating-based queries

// Pre-save middleware to update updatedAt
packageReviewsSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

// Static method to get average rating for a package
packageReviewsSchema.statics.getAverageRating = async function (packageId) {
  const result = await this.aggregate([
    { $match: { package: packageId } },
    {
      $group: {
        _id: null,
        averageRating: { $avg: "$rating" },
        totalReviews: { $sum: 1 },
      },
    },
  ]);

  return result.length > 0
    ? {
        averageRating: Math.round(result[0].averageRating * 10) / 10,
        totalReviews: result[0].totalReviews,
      }
    : { averageRating: 0, totalReviews: 0 };
};

const PackageReviews = mongoose.model("PackageReviews", packageReviewsSchema);
export default PackageReviews;
