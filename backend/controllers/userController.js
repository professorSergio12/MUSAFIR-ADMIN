import User from "../models/auth.model.js";
import { errorHandler } from "../util/error.js";
import bcrypt from "bcryptjs";
import { userSchema } from "../validations/userValidation.js";

export const registerUser = async (req, res, next) => {
  const { error } = userSchema.safeParse(req.body);

  if (error) {
    const err = JSON.parse(error.message);
    return next(errorHandler(400, err[0].message));
  }
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.find({ email });
    if (existingUser.length > 0) {
      return next(errorHandler(400, "User with this email already exists"));
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      password: hashPassword,
    });
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    next(errorHandler(500, "Internal Server Error"));
  }
};

// Login and Logout logic is handled by Musafir backend
// See Musafir/backend/controllers/auth.controller.js for signin and logout
// MUSAFIR-ADMIN frontend uses Musafir backend at /api/auth/signin and /api/auth/logout



