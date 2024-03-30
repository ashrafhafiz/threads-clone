import asyncHandler from "express-async-handler";
import createError from "http-errors";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";

const postController = {
  // Get all posts
  getPosts: asyncHandler(async (req, res) => {
    const posts = await Post.find();
    res.json(posts);
  }),

  // Get specific post
  getPost: asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const post = await Post.findById(postId);
    if (!post) throw createError(404, "Post not found");
    res.json({ post });
  }),

  // Create a new post
  createPost: asyncHandler(async (req, res) => {
    const { text, img } = req.body;
    const currentUser = req.user._id;
    if (!currentUser) throw createError(404, "No signed in user. signin!");
    // Create a new post
    const post = await Post.create({ postedBy: currentUser, text, img });
    // Return the user and token
    res.status(201).json({ post });
  }),

  // Update a specific post
  updatePost: asyncHandler(async (req, res) => {}),

  // Delete a specific post
  deletePost: asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const post = await Post.findById(postId);
    if (!post) throw createError(404, "Post not found");
    const currentUser = req.user._id;
    if (currentUser.toString() !== post.postedBy.toString())
      throw createError(403, "Forbidden action!");
    const deletedPost = await Post.findByIdAndDelete(postId);
    res.json({ message: "Post deleted successfully", post: deletedPost });
  }),

  // Like/Unlike post
  likePost: asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const currentUserId = req.user._id;

    // if (userId === currentUserId)
    //   throw createError(
    //     400,
    //     "Bad request. You can't follow/unfollow yourself!"
    //   );

    if (!currentUserId)
      throw createError(400, "Bad Request: You need to signin!");

    const postToLike = await Post.findById(postId);
    if (!postToLike) throw createError(404, "Post not found!");

    console.log(postToLike);
    const isLiked = postToLike.likes.includes(currentUserId);

    console.log(isLiked);
    if (isLiked) {
      // isLiked = true => unlike
      await Post.findByIdAndUpdate(postToLike._id, {
        $pull: { likes: currentUserId },
      });
      res.json({ message: "Post unliked successfully!" });
    } else {
      // isLiked = false => follow
      await Post.findByIdAndUpdate(postToLike._id, {
        $push: { likes: currentUserId },
      });
      res.json({ message: "Post liked successfully!" });
    }
  }),
};

export default postController;
