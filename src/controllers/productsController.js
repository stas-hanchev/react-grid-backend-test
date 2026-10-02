import { Product } from '../models/product.js';

export const getProducts = async (req, res) => {
  const { page = 1, perPage = 20 } = req.query;

  const pageNumber = Number(page);
  const perPageNumber = Number(perPage);
  const skip = (pageNumber - 1) * perPageNumber;

  const [totalItems, products] = await Promise.all([
    Product.countDocuments(),
    Product.find().sort({ _id: 1 }).skip(skip).limit(perPageNumber),
  ]);

  res.status(200).json({
    page: pageNumber,
    perPage: perPageNumber,
    totalItems,
    totalPages: Math.ceil(totalItems / perPageNumber),
    products,
  });
};
