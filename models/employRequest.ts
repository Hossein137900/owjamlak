import mongoose from "mongoose";

const employRequestSchema = new mongoose.Schema({
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
  file: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: false,
  },
  type: {
    type: String,
    enum: ["Consultation", "LegalConsultation", "Investor", "Others"],
  },
  education: {
    type: String,
    enum: ["Diploma", "Bachelor", "Master", "Phd"],
  },
});
export default mongoose.models.EmployRequest ||
  mongoose.model("employRequest", employRequestSchema);
