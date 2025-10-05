import mongoose from "mongoose";

const TopConsultantSchema = new mongoose.Schema(
  {
    consultant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Consultant is required"],
    },
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    phone: {
      type: String,
      required: [true, "Phone is required"],
    },
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [0, "Rating cannot be less than 0"],
      max: [5, "Rating cannot exceed 5"],
    },
    totalSales: {
      type: Number,
      required: [true, "Total sales is required"],
      min: [0, "Total sales cannot be negative"],
    },
    experience: {
      type: Number,
      required: [true, "Experience is required"],
      min: [0, "Experience cannot be negative"],
    },
    rank: {
      type: Number,
      required: [true, "Rank is required"],
      min: [1, "Rank must be between 1-3"],
      max: [3, "Rank must be between 1-3"],
    },
    image: {
      type: String,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

TopConsultantSchema.index({ rank: 1 }, { unique: true });

export default mongoose.models.TopConsultant ||
  mongoose.model("TopConsultant", TopConsultantSchema);
