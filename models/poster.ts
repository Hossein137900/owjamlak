import mongoose from "mongoose";
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
      type: Number,
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
    parentType: {
      type: String,
      required: true,
      enum: [
        "residentialRent",
        "residentialSale",
        "commercialRent",
        "commercialSale",
        "shortTermRent",
        "ConstructionProject",
      ],
    },
    tradeType: {
      type: String,
      required: true,
      enum: [
        "House",
        "Villa",
        "Old",
        "Office",
        "Shop",
        "industrial",
        "partnerShip",
        "preSale",
      ],
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
    balcony: {
      type: Boolean,
      default: false,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
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
    // Add location coordinates
    coordinates: {
      lat: {
        type: Number,
        required: true,
      },
      lng: {
        type: Number,
        required: true,
      },
    },
    // Add address components for better search
    locationDetails: {
      province: String,
      city: String,
      district: String,
      neighborhood: String,
      fullAddress: String,
    },
    views: {
      type: Number,
      default: 0,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    meta: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      default: {},
    },
    options: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);

posterSchema.index({ status: 1 });
posterSchema.index({ createdAt: -1 });
posterSchema.index({ totalPrice: 1 });
posterSchema.index({ parentType: 1, tradeType: 1, status: 1 });
export default mongoose.models.Poster || mongoose.model("Poster", posterSchema);
