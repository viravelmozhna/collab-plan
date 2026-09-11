import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    // Throwaway accounts created by the "Try the demo" button. Flagged so they
    // can be pruned without touching real users; createdAt comes from
    // timestamps below and is what the pruning is based on.
    isGuest: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const User = model("user", userSchema);

export default User;
