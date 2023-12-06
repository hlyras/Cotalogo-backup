import { Router } from 'express';
const router = Router();
import toHttps from './toHttps.mjs';

import multer from '../middleware/multer.mjs';

import User from '../controller/user.mjs';

import Product from '../controller/product/main.mjs';
import ProductImage from '../controller/product/image.mjs';

router.get('/', toHttps, User.verify, Product.index);
router.post('/save', toHttps, User.verify, multer.any('files'), Product.save);
router.post('/filter', toHttps, User.verify, Product.filter);
router.get('/id/:id', toHttps, User.verify, Product.findById);
// router.delete('/delete/:id', toHttps, User.verify, Product.delete);
router.delete('/image/id/:id', toHttps, User.authorize, ProductImage.delete);

export default router;