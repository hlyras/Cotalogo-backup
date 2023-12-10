import { Router } from 'express';
const router = Router();
import toHttps from './toHttps.js';

import UserAuth from '../controller/user/auth.js';

import Catalog from '../controller/catalog/main.js';
import CatalogProduct from '../controller/catalog/product.js';
import CatalogTheme from '../controller/catalog/theme.js';

router.get('/', toHttps, UserAuth.verify, Catalog.index);
router.post('/create', toHttps, UserAuth.verify, Catalog.create);
router.post('/filter', toHttps, UserAuth.verify, Catalog.filter);
router.get('/id/:id', toHttps, UserAuth.verify, Catalog.findById);
// router.delete('/delete/:id', toHttps, UserAuth.verify, Catalog.delete);

router.post('/product/insert', toHttps, UserAuth.verify, CatalogProduct.insert);
router.post('/product/filter', toHttps, UserAuth.verify, CatalogProduct.filter);

router.get('/theme', toHttps, UserAuth.verify, CatalogTheme.index);

export default router;