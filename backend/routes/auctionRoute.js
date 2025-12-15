

import express from 'express';
import {
  createAuction,
  updateAuction,
  deleteAuction,
  getAuction,
  listAuctions,
  listBids,
  startAuction,
  endAuction,
  placeBid,
  endAuctionAndNotifyWinner
} from '../controllers/auctionController.js';
import adminAuth from '../middleware/adminAuth.js';
import { upload } from '../middleware/multer.js';
import { authUser } from '../middleware/auth.js';
// import { checkVerified } from '../middleware/checkVerified.js';

const router = express.Router();

// Admin-only routes
router.post('/create', adminAuth, upload.single('productImage'), createAuction);
router.put('/update/:id', adminAuth, updateAuction);
router.delete('/delete/:id', adminAuth, deleteAuction);
router.post('/start/:id', adminAuth, startAuction);
router.post('/end/:id', adminAuth, endAuction);

// Public / user routes
router.get('/all', listAuctions);
router.get('/:id', getAuction);
router.get('/:id/bids', listBids);
router.post('/bid', authUser, placeBid); // fallback HTTP route
router.post("/end/:auctionId", endAuctionAndNotifyWinner);


export default router;
