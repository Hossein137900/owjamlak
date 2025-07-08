import mongoose, { Schema, model, models } from "mongoose";

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  parent: { type: Schema.Types.ObjectId, ref: "Category", default: null },
  level: {
    type: Number,
    enum: [1, 2, 3], // 1 = root, 2 = child, 3 = grandchild
    required: true,
  },
});

const Category = models.Category || model("Category", CategorySchema);

export default Category;
