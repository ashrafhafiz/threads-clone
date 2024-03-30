import mongoose from "mongoose";
import validate from "mongoose-validator";
import getHumanDiff from "../utils/getHumanDiff.js";

var textValidator = [
  validate({
    validator: "isLength",
    arguments: [3, 500],
    message: "Post should be between {ARGS[0]} and {ARGS[1]} characters",
  }),
];

const postSchema = new mongoose.Schema(
  {
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      // minLength: 3,
      // maxLength: 500,
      validate: textValidator,
      required: true,
    },
    img: {
      type: String,
    },
    likes: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
    replies: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        text: {
          type: String,
          required: true,
        },
        userProfilePic: {
          type: String,
        },
        username: {
          type: String,
        },
      },
    ],
  },
  {
    // timestamps: { currentTime: () => new Date() },
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

// Virtual field for the createdAt As Human Diff
postSchema.virtual("createdAtAsHumanDiff").get(function () {
  return getHumanDiff(new Date(this.createdAt));
});

// Virtual field for the updatedAt As Human Diff
postSchema.virtual("updatedAtAsHumanDiff").get(function () {
  return getHumanDiff(new Date(this.updatedAt));
});

const Post = mongoose.model("Post", postSchema);

export default Post;
