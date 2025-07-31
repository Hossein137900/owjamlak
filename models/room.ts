import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: ["sent", "delivered", "read"],
      default: "sent",
    },
    seenAt: {
      type: Date,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

module.exports = messageSchema;

const chatRoomSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    posterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Poster",
      required: true,
    },
    messages: [messageSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ChatRoom", chatRoomSchema);
