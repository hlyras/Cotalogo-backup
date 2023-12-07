import { Router } from 'express';
const router = Router();
import toHttps from './toHttps.js';

import User from '../controller/user.js';

import Catalog from '../controller/catalog/main.js';
import CatalogProduct from '../controller/catalog/product.js';
import CatalogTheme from '../controller/catalog/theme.js';

router.get('/', toHttps, User.verify, Catalog.index);
router.post('/create', toHttps, User.verify, Catalog.create);
router.post('/filter', toHttps, User.verify, Catalog.filter);
router.get('/id/:id', toHttps, User.verify, Catalog.findById);
// router.delete('/delete/:id', toHttps, User.verify, Catalog.delete);

router.post('/product/insert', toHttps, User.verify, CatalogProduct.insert);
router.post('/product/filter', toHttps, User.verify, CatalogProduct.filter);

router.get('/theme', toHttps, User.verify, CatalogTheme.index);

export default router;