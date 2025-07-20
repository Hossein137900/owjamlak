import mongoose from "mongoose";

const contactMessageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "accepted", "declined"],
      default: "pending",
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    isTestimonial: {
      type: Boolean,
      default: false,
    },
    adminNote: { type: String },
    acceptedAt: { type: Date },
    declinedAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.models.Contact ||
  mongoose.model("Contact", contactMessageSchema);
