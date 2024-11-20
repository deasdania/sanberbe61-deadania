/**
 * src/models/categories.models.ts
 */
import mongoose, { Types } from "mongoose";

export interface Category extends Document {
  _id?: Types.ObjectId;
  name: string;
  createdAt: string;
  updatedAt: string;
}

const Schema = mongoose.Schema;

const CategorySchema = new Schema<Category>(
  {
    name: {
      type: Schema.Types.String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const CategoryModel = mongoose.model("Category", CategorySchema);

export default CategoryModel;
