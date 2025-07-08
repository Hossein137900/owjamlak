import mongoose from "mongoose";

const legalRequestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: false,
  },
  type: {
    type: String,
    enum: ["Contract", "Solve", "DocumentReview", "Other"],
    required: true,
  },
});
export default mongoose.models.LegalRequest ||
  mongoose.model("LegalRequest", legalRequestSchema);
