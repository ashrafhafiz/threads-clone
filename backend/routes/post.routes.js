import express from "express";
const router = express.Router();
import postController from "../controllers/post.controller.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.middleware.js";

// GET /posts - get all posts
// POST /posts - create a new post
router
  .route("/posts")
  .get(postController.getPosts)
  .post(isAuthenticated, postController.createPost);

// GET /posts/:postId - get a specific post
// PUT /posts/:postId - update a specific post
// DELETE /posts/:postId - delete a specific post
router
  .route("/posts/:postId")
  .get(postController.getPost)
  .put(isAuthenticated, postController.updatePost)
  .delete(isAuthenticated, postController.deletePost);

router.post("/posts/like/:postId", isAuthenticated, postController.likePost);

export default router;
