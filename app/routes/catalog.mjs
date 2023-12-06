import { Router } from 'express';
const router = Router();
import toHttps from './toHttps.mjs';

import User from '../controller/user.mjs';

import Catalog from '../controller/catalog/main.mjs';
import CatalogProduct from '../controller/catalog/product.mjs';
import CatalogTheme from '../controller/catalog/theme.mjs';

router.get('/', toHttps, User.verify, Catalog.index);
router.post('/create', toHttps, User.verify, Catalog.create);
router.post('/filter', toHttps, User.verify, Catalog.filter);
router.get('/id/:id', toHttps, User.verify, Catalog.findById);
// router.delete('/delete/:id', toHttps, User.verify, Catalog.delete);

router.post('/product/insert', toHttps, User.verify, CatalogProduct.insert);
router.post('/product/filter', toHttps, User.verify, CatalogProduct.filter);

router.get('/theme', toHttps, User.verify, CatalogTheme.index);

export default router;