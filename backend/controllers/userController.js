import User from "../models/auth.model.js";
import { errorHandler } from "../util/error.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { signinSchema, userSchema } from "../validations/userValidation.js";

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

export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  const { error } = signinSchema.safeParse(req.body);
  if (error) {
    console.log(JSON.parse(error.message)[0].message);
    return next(errorHandler(400, JSON.parse(error.message)[0].message));
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return next(errorHandler(404, "User not found"));
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return next(errorHandler(400, "Wrong password"));
    }
    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );
    const { password: pwd, ...rest } = user._doc;
    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(rest);
  } catch (error) {
    console.error(error);
    next(error);
  }
};



