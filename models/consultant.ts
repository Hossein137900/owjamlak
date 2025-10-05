import mongoose from "mongoose";

const ConsultantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "نام مشاور الزامی است"],
      trim: true,
      maxlength: [100, "نام نمی‌تواند بیش از 100 کاراکتر باشد"],
    },
    phone: {
      type: String,
      required: [true, "شماره تلفن الزامی است"],
      match: [/^09\d{9}$/, "شماره تلفن معتبر نیست"],
    },
    whatsapp: {
      type: String,
      required: [true, "شماره واتساپ الزامی است"],
      match: [/^09\d{9}$/, "شماره واتساپ معتبر نیست"],
    },
    email: {
      type: String,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "ایمیل معتبر نیست",
      ],
    },
    image: {
      type: String,
      required: [true, "تصویر مشاور الزامی است"],
    },
    experienceYears: {
      type: Number,
      required: [true, "سال‌های تجربه الزامی است"],
      min: [0, "سال‌های تجربه نمی‌تواند منفی باشد"],
      max: [50, "سال‌های تجربه نمی‌تواند بیش از 50 سال باشد"],
    },
    posterCount: {
      type: Number,
      default: 0,
      min: [0, "تعداد آگهی نمی‌تواند منفی باشد"],
    },
    workAreas: [
      {
        type: String,
        required: true,
        trim: true,
      },
    ],
    specialties: [
      {
        type: String,
        trim: true,
      },
    ],
    rating: {
      type: Number,
      min: [1, "امتیاز نمی‌تواند کمتر از 1 باشد"],
      max: [5, "امتیاز نمی‌تواند بیشتر از 5 باشد"],
    },
    description: {
      type: String,
      maxlength: [500, "توضیحات نمی‌تواند بیش از 500 کاراکتر باشد"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,  
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Consultant ||
  mongoose.model("Consultant", ConsultantSchema);
