import { Joi, Segments } from 'celebrate';

export const getProductsSchema = {
  [Segments.QUERY]: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    perPage: Joi.number().integer().min(1).max(100).default(20),
    category: Joi.string().trim().optional(),
    categoryId: Joi.number().integer().min(1).optional(),
  }),
};
