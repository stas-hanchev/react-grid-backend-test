import { Category } from '../models/category.js';
import { withLiveStats } from '../services/categories.js';

export const getCategories = async (req, res) => {
  const categories = await Category.find().sort({ id: 1 }).lean();

  res.status(200).json(await withLiveStats(categories));
};
