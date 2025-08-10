const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },

    imageUrl: {
      type: String,
      default:
        "https://zaaopnogqwbkasyujppf.supabase.co/storage/v1/object/public/culinary-art/users/default-user-logo.png",
    },

    bio: {
      type: String,
      default: "",
    },

    role: {
      type: String,
      default: "customer",
    },
    bookmarks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Recipe",
      },
    ],
    userLikeCount: {
      type: Number,
      default: 0,
    },

    creditPoints: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
