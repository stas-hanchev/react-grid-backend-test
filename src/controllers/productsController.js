import { Product } from '../models/product.js';
import { getSubtreeIds } from '../services/categories.js';

export const getProducts = async (req, res) => {
  const { page = 1, perPage = 20, category, categoryId } = req.query;

  const pageNumber = Number(page);
  const perPageNumber = Number(perPage);
  const skip = (pageNumber - 1) * perPageNumber;

  const filter = {};

  if (category) {
    filter.category = category;
  }

  if (categoryId) {
    filter.categoryId = { $in: await getSubtreeIds(Number(categoryId)) };
  }

  const [totalItems, products] = await Promise.all([
    Product.countDocuments(filter),
    Product.find(filter).sort({ _id: 1 }).skip(skip).limit(perPageNumber),
  ]);

  res.status(200).json({
    page: pageNumber,
    perPage: perPageNumber,
    totalItems,
    totalPages: Math.ceil(totalItems / perPageNumber),
    products,
  });
};
