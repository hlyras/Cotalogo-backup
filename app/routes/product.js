import { Router } from 'express';
const router = Router();
import toHttps from './toHttps.js';

import multer from '../middleware/multer.js';

import UserAuth from '../controller/user/main.js';

import Product from '../controller/product/main.js';
import ProductImage from '../controller/product/image.js';

// router.get('/', toHttps, UserAuth.verify, Product.index);
// router.post('/save', toHttps, UserAuth.verify, multer.any('files'), Product.save);
// router.post('/filter', toHttps, UserAuth.verify, Product.filter);
// router.get('/id/:id', toHttps, UserAuth.verify, Product.findById);
// // router.delete('/delete/:id', toHttps, UserAuth.verify, Product.delete);
// router.delete('/image/id/:id', toHttps, UserAuth.authorize, ProductImage.delete);

export default router;