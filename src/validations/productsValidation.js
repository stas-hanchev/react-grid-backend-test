import {
  Joi,
  Segments
} from 'celebrate';
import { PRODUCT_STATUSES } from '../models/product.js';

const objectId = Joi.string().hex().length(24);

export const getProductsSchema = {
  [Segments.QUERY]: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    perPage: Joi.number().integer().min(1).max(100).default(20),
    category: Joi.string().trim().optional(),
    categoryId: Joi.number().integer().min(1).optional(),
    search: Joi.string().trim().max(100).allow('').optional(),
    sort: Joi.string().optional(),
  }),
};

const editableFields = {
  name: Joi.string().trim().min(1).max(200),
  brand: Joi.string().trim().min(1).max(100),
  status: Joi.string().valid(...PRODUCT_STATUSES),
  price: Joi.number().min(0),
  discountPercent: Joi.number().min(0).max(100),
  stockQuantity: Joi.number().integer().min(0),
  isFeatured: Joi.boolean(),
  categoryId: Joi.number().integer().min(1),
};

export const createProductSchema = {
  [Segments.BODY]: Joi.object({
    ...editableFields,
    name: editableFields.name.required(),
    brand: editableFields.brand.required(),
    price: editableFields.price.required(),
    categoryId: editableFields.categoryId.required(),
  }),
};

export const updateProductSchema = {
  [Segments.PARAMS]: Joi.object({ productId: objectId.required() }),
  [Segments.BODY]: Joi.object(editableFields).min(1),
};

export const productIdSchema = {
  [Segments.PARAMS]: Joi.object({ productId: objectId.required() }),
};
