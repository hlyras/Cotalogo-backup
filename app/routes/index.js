import { Router } from 'express';
const router = Router();
import toHttps from './toHttps.js';

import homeController from '../controller/home.js';

import UserRouter from './user.js';
import ProductRouter from './product.js';
import CategoryRouter from './category.js';
import CatalogRouter from './catalog.js';

router.get("/", toHttps, homeController.index);

router.use("/user", UserRouter);
router.use("/product", ProductRouter);
router.use("/category", CategoryRouter);
router.use("/catalog", CatalogRouter);

export default router;