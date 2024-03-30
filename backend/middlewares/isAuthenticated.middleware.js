import asyncHandler from "express-async-handler";
import createError from "http-errors";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const isAuthenticated = asyncHandler(async (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    throw createError(401, "Unauthorized!");
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const currentUser = await User.findById(decoded.userId).select("-password");
  req.user = currentUser;
  next();
});
