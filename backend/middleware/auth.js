import { errorHandler } from "../util/error.js";
import jwt from "jsonwebtoken";

export const userAuth = (req, res, next) => {
  const { access_token } = req.cookies;
  if (!access_token) {
    return next(
      errorHandler(
        401,
        "You are not logged in! Please log in to access this resource."
      )
    );
  }

  const token = jwt.verify(access_token, process.env.JWT_SECRET);
  if (!token) {
    return next(errorHandler(401, "You are not logged in! Token is expired."));
  }
  console.log("tokrn is :", token);
  req.user = token;
  next();
};
