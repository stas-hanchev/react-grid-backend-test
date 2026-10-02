import { Router } from 'express';
import { celebrate } from 'celebrate';

import { getProducts } from '../controllers/productsController.js';
import { getProductsSchema } from '../validations/productsValidation.js';

const router = Router();

router.get('/products', celebrate(getProductsSchema), getProducts);

export default router;
