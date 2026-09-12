// Mongoose import kar rahe hain.
import mongoose from "mongoose";

// User ka database schema bana rahe hain.
const userSchema = new mongoose.Schema(
  {
    // User ka naam.
    name: {
      type: String,
      required: true,
      trim: true,
    },

    // User ka email.
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    // Password.
    // Google users ke liye password zaroori nahi hoga.
    password: {
      type: String,
      required: false,
      select: false,
    },

    // Google OAuth ke liye Google user ID.
    googleId: {
      type: String,
      required: false,
      unique: true,
      sparse: true,
    },

    // User ka role.
    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer",
    },

    // Email verification status.
    isVerified: {
      type: Boolean,
      default: false,
    },

    // Email verification token ki hashed value.
    verificationToken: {
      type: String,
      required: false,
    },

    // Verification token ki expiry.
    verificationTokenExpires: {
      type: Date,
      required: false,
    },

    // Password reset token ki hashed value.
    resetPasswordToken: {
      type: String,
      required: false,
    },

    // Password reset token ki expiry.
    resetPasswordExpires: {
      type: Date,
      required: false,
    },

    // Password reset ya security changes ke baad
    // sessions invalidate karne ke liye version.
    sessionVersion: {
      type: Number,
      default: 0,
    },
  },

  // createdAt aur updatedAt automatically add honge.
  {
    timestamps: true,
  }
);

// Existing model ko reuse karenge.
// Agar model pehle se registered nahi hai to naya model banega.
const User =
  mongoose.models.User || mongoose.model("User", userSchema);

// User model export kar rahe hain.
export default User;