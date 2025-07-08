import mongoose from "mongoose";

const ConsultantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    avatar: {
      type: String,
      required: [true, "Avatar is required"],
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

    phone: {
      type: String,
      required: [false, "Phone is required"],
    },
    email: {
      type: String,
      required: false,
    },

    isTopConsultant: {
      type: Boolean,
    },
    isActive: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Consultant ||
  mongoose.model("Consultant", ConsultantSchema);
