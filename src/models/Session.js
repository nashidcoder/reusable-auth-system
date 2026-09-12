// Mongoose import kar rahe hain.
import mongoose from "mongoose";

// Authentication session ka schema bana rahe hain.
const sessionSchema = new mongoose.Schema(
  {
    // Kis user ki session hai.
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Refresh token ka hashed version store hoga.
    refreshTokenHash: {
      type: String,
      required: true,
      unique: true,
    },

    // Token family identify karne ke liye unique family ID.
    familyId: {
      type: String,
      required: true,
      index: true,
    },

    // Refresh session kab expire hogi.
    expiresAt: {
      type: Date,
      required: true,
    },

    // Session revoke hui ya nahi.
    revoked: {
      type: Boolean,
      default: false,
    },

    // Rotation ke baad next session ka ID.
    replacedBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
    },
  },

  // createdAt aur updatedAt automatically create hongi.
  { timestamps: true }
);

// Expired sessions ko MongoDB automatically remove karega.
sessionSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0 }
);

// Existing model ko reuse karenge.
const Session =
  mongoose.models.Session || mongoose.model("Session", sessionSchema);

// Session model export kar rahe hain.
export default Session;