import mongoose from "mongoose";
import User from "./user";
const posterSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    images: [
      {
        alt: String,
        url: String,
        mainImage: Boolean,
      },
    ],
    buildingDate: {
      type: Date,
      required: true,
    },
    area: {
      type: Number,
      required: true,
    },
    rooms: {
      type: Number,
      required: true,
    },
    propertyType: {
      type: String,
      required: true,
      enum: [
        "residential",
        "administrative",
        "commercial",
        "industrial",
        "old",
      ],
    },
    tradeType: {
      type: String,
      required: true,
      enum: ["rent", "fullRent", "buy", "sell"],
    },
    totalPrice: {
      type: Number,
    },
    pricePerMeter: {
      type: Number,
    },
    depositRent: {
      type: Number,
    },
    convertible: {
      type: Boolean,
    },
    rentPrice: {
      type: Number,
    },
    location: {
      type: String,
      required: true,
    },
    contact: {
      type: String,
      required: true,
    },
    storage: {
      type: Boolean,
      default: false,
    },
    floor: {
      type: Number,
    },
    parking: {
      type: Boolean,
      default: false,
    },
    lift: {
      type: Boolean,
      default: false,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
      required: true,
    },
    type: {
      type: String,
      enum: ["normal", "investment"],
      default: "normal",
    },
    status: {
      type: String,
      required: true,
      enum: ["active", "pending", "sold", "rented"],
    },
    views: {
      type: Number,
      default: 0,
    },
    // Track unique viewers to prevent duplicate views
    viewedBy: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.models.Poster || mongoose.model("Poster", posterSchema);
