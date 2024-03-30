import asyncHandler from "express-async-handler";
import createError from "http-errors";
// import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import getHumanDiff from "../utils/getHumanDiff.js";

const authController = {
  // signup == register a new user
  signup: asyncHandler(async (req, res) => {
    const { name, username, email, password } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw createError(409, "User already exists");
    }

    // Create a new user
    const user = await User.create({
      name,
      username,
      email,
      password,
    });

    // Generate a JWT token
    const token = generateTokenAndSetCookie(user._id, res);

    // Return the user and token
    res.status(201).json({ user, token });
  }),

  // signin == login an existing user
  signin: asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    // if (!user) {
    //   throw createError(401, "Invalid email or password");
    // }

    // Validate the provided password
    // const isPasswordValid = await User.validatePassword(
    //     password,
    //     user.password
    //   );
    const isPasswordValid = await User.validatePassword(
      password,
      user?.password || ""
    );
    if (!user || !isPasswordValid) {
      throw createError(401, "Invalid Credentials!");
    }

    // Generate a JWT token
    const token = generateTokenAndSetCookie(user._id, res);

    // Update last login timestamp
    await user.updateLastLogin();

    const userInfo = {
      name: user.name,
      email: user.email,
      lastLoginAsHumanDiff: user.lastLoginAsHumanDiff,
    };

    // Return the user and token
    res.json({ userInfo, token });
  }),

  // signout == logout an existing user
  signout: asyncHandler(async (req, res) => {
    const token = req.cookies.jwt;
    if (!token) {
      throw createError(401, "No user is signed in. Please signin!");
    }
    const payload = jwt.decode(token);

    if (Date.now() >= payload.exp * 1000) {
      throw createError(401, "Token is expried. Please signin!");
    }
    const loggedInUser = await User.findOne({ _id: payload.userId });
    // res.cookie("jwt", "", { maxAge: 1 });

    // Return the user and token
    res.status(200).json({
      lastLogin: `User: ${loggedInUser.name}, signed in: ${loggedInUser.lastLoginAsHumanDiff}`,
      message: `User: ${loggedInUser.name}, signed out successfully!`,
    });
  }),
};

// Generate a JWT token
function generateTokenAndSetCookie(userId, res) {
  // Generate a token with the user ID as the payload
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    maxAge: 1 * 60 * 60 * 1000,
    sameSite: "strict",
  });

  return token;
}

export default authController;
