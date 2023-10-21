import { Router } from 'express';
import { body, param } from 'express-validator';
import { handleInputErrors } from './modules/middleware';
import { createProduct, deleteProduct, getProduct, getProducts, updateProduct } from './handlers/product';
import { createUpdate, deleteUpdate, getOneUpdate, getUpdates, updateUpdate } from './handlers/update';

//router = a subpart of an api....app = the whole api, the global app
const router = Router();

//think: separate routes for auth'ed stuff and non-auth'ed stuff

//Product routes
router.get('/product', getProducts); //need to handle scenario where user has no existing products
router.get('/product/:id', getProduct);
router.put('/product/:id', [param('id').isString(), body('name').isString(), handleInputErrors], updateProduct);
router.post('/product', [body('name').isString(), handleInputErrors], createProduct);
router.delete('/product/:id', deleteProduct);

//Update routes
router.get('/update', getUpdates);
router.get('/update/:id', getOneUpdate);
router.put(
  '/update/:id',
  [
    body('title').optional(),
    body('body').optional(),
    body('status').isIn(['IN_PROGRESS', 'SHIPPED', 'DEPRECATED']).optional(),
    body('version').optional(),
    handleInputErrors,
  ],
  updateUpdate,
);
router.post('/update', [body('title').exists(), body('body').exists(), handleInputErrors], createUpdate);
router.delete('/update/:id', deleteUpdate);

export default router;
