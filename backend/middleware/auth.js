import { errorHandler } from "../util/error.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

// Import User model from Musafir (since authentication is handled by Musafir backend)
// Both backends use the same MongoDB database, so we can use the same User model
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
      default:
        "https://res.cloudinary.com/dpu6rveug/image/upload/v1763527341/profile-img_iq5gto.webp",
    },
    profilePictureId: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

export const userAuth = async (req, res, next) => {
  const { access_token } = req.cookies;
  if (!access_token) {
    return next(
      errorHandler(
        401,
        "You are not logged in! Please log in to access this resource."
      )
    );
  }

  try {
    const decoded = jwt.verify(access_token, process.env.JWT_SECRET);
    
    // Verify user exists and is admin
    const user = await User.findById(decoded.id);
    if (!user) {
      return next(errorHandler(404, "User not found"));
    }

    // Check if user is admin (Musafir backend uses 'role' field)
    if (user.role !== "admin") {
      return next(errorHandler(403, "You are not admin. Access denied."));
    }

    req.user = { id: decoded.id, role: user.role };
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return next(errorHandler(401, "Invalid token"));
    }
    if (error.name === "TokenExpiredError") {
      return next(errorHandler(401, "Token expired. Please login again."));
    }
    return next(errorHandler(401, "Authentication failed"));
  }
};
