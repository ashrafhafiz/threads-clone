import bcrypt from "bcryptjs";
import asyncHandler from "express-async-handler";
import createError from "http-errors";
import User from "../models/user.model.js";
// import getHumanDiff from "../utils/getHumanDiff.js";

const userController = {
  // Get all users
  getUsers: asyncHandler(async (req, res) => {
    const users = await User.find();
    if (!users) throw createError(404, "No User found!");

    res.json({ users });
  }),

  // Get a specific user
  getUser: asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) throw createError(404, "User not found");

    res.json({ user });
  }),

  // Get a user profile by username
  getUserProfile: asyncHandler(async (req, res) => {
    const { username } = req.params;
    const user = await User.findOne({ username }).select(
      "-password -updatedAt"
    );
    if (!user) throw createError(404, "User not found");

    res.json({ user });
  }),

  // Update a user
  updateUser: asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const currentUserId = req.user._id.toString();

    if (userId !== currentUserId)
      throw createError(
        403,
        "Forbidden request. You can't update other user's profile!"
      );

    let { name, username, email, password, profilePic, bio } = req.body;
    // if (password) password = await bcrypt.hash(password, 10);
    // The pre "findOneAndUpdate" middleware will be used to hash the password in the user model.
    // findByIdAndUpdate(id, ...) is equivalent to findOneAndUpdate({ _id: id }, ...).
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      { $set: { name, username, email, password, profilePic, bio } },
      { new: true }
    );
    if (!updatedUser) throw createError(404, "User not found");

    res.json(updatedUser);
  }),

  // Delete a user
  deleteUser: asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) throw createError(404, "User not found");
    const currentUser = req.user._id;
    if (currentUser.toString() !== user._id.toString())
      throw createError(403, "Forbidden action!");
    const deletedUser = await User.findByIdAndDelete(userId);
    res.json({ message: "User deleted successfully", user: deletedUser });
  }),

  // Follow - Unfollow a user
  followUser: asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const currentUserId = req.user.id;

    if (userId === currentUserId)
      throw createError(
        400,
        "Bad request. You can't follow/unfollow yourself!"
      );

    const currentUser = await User.findById(currentUserId);
    const userToFollow = await User.findById(userId);
    if (!currentUser || !userToFollow) throw createError(404, "User not found");

    const isFollowing = currentUser.following.includes(userId);
    if (isFollowing) {
      // isFollowing = true => unfollow
      await User.findByIdAndUpdate(currentUserId, {
        $pull: { following: userId },
      });
      // modify the followers of the followed user
      await User.findByIdAndUpdate(userId, {
        $pull: { followers: currentUserId },
      });
      res.json({ message: "User unfollowed successfully!" });
    } else {
      // isFollowing = false => follow
      await User.findByIdAndUpdate(currentUserId, {
        $push: { following: userId },
      });
      // modify the followers of the followed user
      await User.findByIdAndUpdate(userId, {
        $push: { followers: currentUserId },
      });
      res.json({ message: "User followed successfully!" });
    }
  }),
};

export default userController;
