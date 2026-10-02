import { Category } from '../models/category.js';

export const getCategories = async (req, res) => {
  const categories = await Category.find().sort({ id: 1 });
  res.status(200).json(categories);
};
