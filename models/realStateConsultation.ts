import mongoose from "mongoose";

const realStateRequestSchema = new mongoose.Schema({
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
    enum: ["Apartment", "Villa", "EmptyEarth", "Commercial", "Other"],
    required: true,
  },
  serviceType: {
    type: String,
    enum: ["Buy", "Sell", "Rent", "Mortgage", "Pricing"],
    required: true,
  },
  budget: {
    type: Number,
  },
});
export default mongoose.models.RealStateRequest ||
  mongoose.model("RealStateRequest", realStateRequestSchema);
