import { model, Schema } from 'mongoose';

const categorySchema = new Schema({
  id: { type: Number, required: true, unique: true },
  parentId: { type: Number, default: null },
  name: { type: String, required: true, trim: true },
  level: { type: Number, required: true, min: 0, max: 2 },
  path: { type: String, required: true },
  slug: { type: String, required: true },
  sortOrder: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  productCount: { type: Number, default: 0 },
  totalStock: { type: Number, default: 0 },
  avgPrice: { type: Number, default: 0 },
});

export const Category = model('Category', categorySchema);
