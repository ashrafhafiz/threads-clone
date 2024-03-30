import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import getHumanDiff from "../utils/getHumanDiff.js";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      minLength: 6,
      required: true,
    },
    profilePic: {
      type: String,
      default: "",
    },
    // followers: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "User",
    //   },
    // ],
    followers: {
      type: [String],
      default: [],
    },
    following: {
      type: [String],
      default: [],
    },
    bio: {
      type: String,
      default: "",
    },
    lastLogin: {
      type: Date,
    },
  },
  {
    // timestamps: { currentTime: () => new Date() },
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

// Virtual field for the full name
userSchema.virtual("lastLoginAsHumanDiff").get(function () {
  if (!this.lastLogin) return "NA";
  return getHumanDiff(new Date(this.lastLogin));
});

// Hash the password before saving the user
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  try {
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

// Hash the password before updating the user
userSchema.pre("findOneAndUpdate", async function (next) {
  // Check if password field is updated
  const update = this.getUpdate();
  console.log(update);
  if (!update.$set || !update.$set.password) {
    return next(); // Skip if password isn't being updated
  }

  // Hash the new password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(update.$set.password, salt);

  // Update the password with the hashed value
  update.$set.password = hashedPassword;
  next();
});

// Static method to validate password
userSchema.statics.validatePassword = async function (
  password,
  hashedPassword
) {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (error) {
    throw error;
  }
};

// Update the last login timestamp
userSchema.methods.updateLastLogin = async function () {
  this.lastLogin = new Date();
  await this.save();
};

const User = mongoose.model("User", userSchema);

export default User;
