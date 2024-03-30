import express from "express";
const router = express.Router();
import userController from "../controllers/user.controller.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.middleware.js";

// GET /users
router.get("/users", userController.getUsers);

// GET /users/:userId
// router.get("/users/:userId", userController.getUser);

// PUT /users/:userId
// router.put("/users/:userId", userController.updateUser);

// DELETE /users/:userId
// router.delete("/users/:userId", userController.deleteUser);

// GET /users/:userId
// PUT /users/:userId
// DELETE /users/:userId
router
  .route("/users/:userId")
  .get(userController.getUser)
  .put(isAuthenticated, userController.updateUser)
  .delete(isAuthenticated, userController.deleteUser);

// POST Follow-Unfollow /users/follow/:userId
router.post(
  "/users/follow/:userId",
  isAuthenticated,
  userController.followUser
);

// GET Profile by username /users/profile/:username
router.get("/users/profile/:username", userController.getUserProfile);

export default router;
