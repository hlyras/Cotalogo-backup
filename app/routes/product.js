import { Router } from 'express';
const router = Router();
import toHttps from './toHttps.js';

import multer from '../middleware/multer.js';

import User from '../controller/user.js';

import Product from '../controller/product/main.js';
import ProductImage from '../controller/product/image.js';

router.get('/', toHttps, User.verify, Product.index);
router.post('/save', toHttps, User.verify, multer.any('files'), Product.save);
router.post('/filter', toHttps, User.verify, Product.filter);
router.get('/id/:id', toHttps, User.verify, Product.findById);
// router.delete('/delete/:id', toHttps, User.verify, Product.delete);
router.delete('/image/id/:id', toHttps, User.authorize, ProductImage.delete);

export default router;