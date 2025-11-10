import express from 'express'
import {listProducts,addProduct,removeProduct,singleProduct,updateProduct,getProductsByCategory, getRelatedProducts, getForHimProducts, getForHerProducts, getFilteredProducts} from '../controllers/productController.js'
import { uploadColorImages } from "../middleware/cloudinaryUpload.js";
import adminAuth from '../middleware/adminAuth.js';

const productRouter = express.Router();

productRouter.post('/add', adminAuth, uploadColorImages, addProduct)
productRouter.post('/update', adminAuth, uploadColorImages, updateProduct)
productRouter.post('/remove', adminAuth, removeProduct)
productRouter.post('/single', singleProduct)
productRouter.get('/list', listProducts)
productRouter.get('/category/:category/filtered', getFilteredProducts)
productRouter.get('/category/:category', getProductsByCategory)
productRouter.get("/related/:id", getRelatedProducts);
productRouter.get('/for-him', getForHimProducts);
productRouter.get('/for-her', getForHerProducts);

export default productRouter