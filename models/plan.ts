import mongoose from "mongoose";

const planSchema = new mongoose.Schema({
  name: String, // مثلا "پلن پایه" یا "طلایی"
  price: Number, // هزینه
  durationDays: Number, // مثلا 30 روز
  maxPosters: Number, // سقف آگهی
  features: [String], // امکانات ویژه
});
export default mongoose.models.Plan || mongoose.model("Plan", planSchema);
