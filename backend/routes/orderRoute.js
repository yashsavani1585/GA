// import express from 'express'
// import {placeOrder, placeOrderRazorpay, allOrders, userOrders, updateStatus} from '../controllers/orderController.js'
// import adminAuth from '../middleware/adminAuth.js'
// import authUser from '../middleware/auth.js'
// const orderRouter = express.Router()

// // Admin Features
// orderRouter.post('/list', adminAuth, allOrders)
// orderRouter.post('/status', adminAuth, updateStatus)

// // Payment Features
// orderRouter.post('/place', authUser, placeOrder)
// // orderRouter.post('/stripe', authUser, placeOrderStripe)
// orderRouter.post('/razorpay', authUser, placeOrderRazorpay)

// // User Features
// orderRouter.post('/userorders', authUser, userOrders)

// //verify payment
// // orderRouter.post('/verifyStripe', authUser, verifyStripe)

// export default orderRouter

import express from 'express'
import {placeOrder, placeOrderRazorpay, allOrders, userOrders, updateStatus, getMyOrders, saveOrderAddress, getOrdersFromPaymentRecord, paymentRecords} from '../controllers/orderController.js'
import adminAuth from '../middleware/adminAuth.js'
import { authUser } from "../middleware/auth.js";
const orderRouter = express.Router()

// Admin Features
orderRouter.post('/list', allOrders)
orderRouter.post('/status', updateStatus)
orderRouter.get("/my-orders/:userId", getMyOrders);
orderRouter.get("/my-orders2/:userId",getOrdersFromPaymentRecord);
orderRouter.get("/payment-records", paymentRecords);



// Payment Features
orderRouter.post('/place', authUser, placeOrder)
// orderRouter.post('/stripe', authUser, placeOrderStripe)
orderRouter.post('/razorpay', authUser, placeOrderRazorpay)

// User Features
orderRouter.post('/userorders', authUser, userOrders)

orderRouter.post("/save-address", saveOrderAddress);


//verify payment
// orderRouter.post('/verifyStripe', authUser, verifyStripe)

export default orderRouter