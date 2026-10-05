import createHttpError from 'http-errors';
import { Category } from '../models/category.js';
import { Product } from '../models/product.js';

export const resolveCategoryFields = async (categoryId) => {
  const leaf = await Category.findOne({ id: categoryId, level: 2 }).lean();

  if (!leaf) {
    throw createHttpError(400, 'categoryId must be an existing leaf category');
  }

  const [category, subcategory, categoryLeaf] = leaf.path.split(' > ');

  return { categoryId, category, subcategory, categoryLeaf };
};

export const generateSku = async () => {
  const last = await Product.findOne().sort({ sku: -1 }).select('sku').lean();
  const lastNumber = last ? Number(last.sku.replace('PRD-', '')) : 0;

  return `PRD-${String(lastNumber + 1).padStart(5, '0')}`;
};
