import { Router } from 'express';
import { celebrate } from 'celebrate';

import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from '../controllers/productsController.js';
import {
  createProductSchema,
  getProductsSchema,
  productIdSchema,
  updateProductSchema,
} from '../validations/productsValidation.js';

const router = Router();

router.get('/products', celebrate(getProductsSchema), getProducts);

router.post('/products', celebrate(createProductSchema), createProduct);

router.patch(
  '/products/:productId',
  celebrate(updateProductSchema),
  updateProduct,
);

router.delete(
  '/products/:productId',
  celebrate(productIdSchema),
  deleteProduct,
);

export default router;
