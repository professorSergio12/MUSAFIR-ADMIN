import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/auth.model.js";
import { errorHandler } from "../util/error.js";
import { adminSigninSchema } from "../validations/adminAuth.validation.js";

/** Fixed admin panel login (no public registration). */
const BUILTIN_ADMIN_ID = "admin123";
const BUILTIN_ADMIN_PASSWORD = "root@123";
/** Stable email for the auto-provisioned admin user (Mongo + JWT). */
const BUILTIN_ADMIN_EMAIL = "admin.portal@musafir.local";

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  path: "/",
};

export const adminSignin = async (req, res, next) => {
  const parsed = adminSigninSchema.safeParse(req.body);
  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message ?? "Invalid input";
    return next(errorHandler(400, msg));
  }

  const { adminId, password } = parsed.data;

  if (adminId !== BUILTIN_ADMIN_ID || password !== BUILTIN_ADMIN_PASSWORD) {
    return next(errorHandler(401, "Invalid admin ID or password"));
  }

  try {
    let user = await User.findOne({ email: BUILTIN_ADMIN_EMAIL });

    if (!user) {
      const hashPassword = await bcrypt.hash(BUILTIN_ADMIN_PASSWORD, 10);
      user = await User.create({
        username: BUILTIN_ADMIN_ID,
        email: BUILTIN_ADMIN_EMAIL,
        password: hashPassword,
        role: "admin",
      });
    } else if (user.role !== "admin") {
      user.role = "admin";
      await user.save();
    }

    const token = jwt.sign(
      { id: user._id, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    const userObj = user.toObject();
    const { password: _pwd, ...rest } = userObj;
    res
      .cookie("access_token", token, cookieOptions)
      .status(200)
      .json({
        ...rest,
        role: "admin",
      });
  } catch (e) {
    next(e);
  }
};

export const adminLogout = async (req, res, next) => {
  try {
    res
      .clearCookie("access_token", { path: "/" })
      .status(200)
      .json({ message: "Logged out successfully" });
  } catch (e) {
    next(e);
  }
};

export const adminVerify = async (req, res, next) => {
  try {
    const token = req.cookies.access_token;
    if (!token) {
      return next(errorHandler(401, "Unauthorized - No token provided"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return next(errorHandler(404, "User not found"));
    }

    if (user.role !== "admin") {
      return next(errorHandler(403, "You are not admin"));
    }

    const userObj = user.toObject();
    const { password: _pwd, ...rest } = userObj;
    res.status(200).json({
      ...rest,
      role: user.role,
    });
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return next(errorHandler(401, "Invalid token"));
    }
    if (error.name === "TokenExpiredError") {
      return next(errorHandler(401, "Token expired"));
    }
    next(error);
  }
};
