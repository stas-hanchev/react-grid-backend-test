import createHttpError from 'http-errors';
import { Product } from '../models/product.js';
import { getSubtreeIds } from '../services/categories.js';
import { generateSku, resolveCategoryFields } from '../services/product.js';
import { buildSearchFilter } from '../services/search.js';
import { parseSort, SORT_COLLATION } from '../services/sorting.js';

export const getProducts = async (req, res) => {
  const {
    page = 1,
    perPage = 20,
    category,
    categoryId,
    search,
    sort,
  } = req.query;

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

  if (search) {
    Object.assign(filter, buildSearchFilter(search));
  }

  const sortBy = {};

  if (sort) {
    Object.assign(sortBy, parseSort(sort));
  }

  sortBy._id = 1;

  const [totalItems, products] = await Promise.all([
    Product.countDocuments(filter),
    Product.find(filter)
      .collation(SORT_COLLATION)
      .sort(sortBy)
      .skip(skip)
      .limit(perPageNumber),
  ]);

  res.status(200).json({
    page: pageNumber,
    perPage: perPageNumber,
    totalItems,
    totalPages: Math.ceil(totalItems / perPageNumber),
    products,
  });
};

export const createProduct = async (req, res) => {
  const { categoryId, stockQuantity = 0, ...data } = req.body;

  const product = await Product.create({
    owner: 'Unassigned',
    cost: 0,
    ...data,
    ...(await resolveCategoryFields(categoryId)),
    sku: await generateSku(),
    stock: { quantity: stockQuantity },
  }).catch((error) => {
    if (error.code === 11000) {
      throw createHttpError(409, 'SKU already exists, please retry');
    }
    throw error;
  });

  res.status(201).json(product);
};

export const updateProduct = async (req, res) => {
  const { productId } = req.params;
  const { categoryId, stockQuantity, ...changes } = req.body;

  const update = { ...changes };

  if (stockQuantity !== undefined) {
    update['stock.quantity'] = stockQuantity;
  }

  if (categoryId !== undefined) {
    Object.assign(update, await resolveCategoryFields(categoryId));
  }

  const product = await Product.findByIdAndUpdate(
    productId,
    { $set: update },
    { returnDocument: 'after', runValidators: true },
  );

  if (!product) {
    throw createHttpError(404, 'Product not found');
  }

  res.status(200).json(product);
};

export const deleteProduct = async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.productId);

  if (!product) {
    throw createHttpError(404, 'Product not found');
  }

  res.status(204).end();
};
