// config/schedule.js
import schedule from "node-schedule";
import { endAuctionAndNotifyWinner } from "../controllers/auctionController.js";

export const scheduleAuctionEnd = (auctionId, endTime) => {
  console.log(`🕒 Auction ${auctionId} scheduled to end at ${endTime}`);
  schedule.scheduleJob(endTime, async () => {
    try {
      console.log(`🚨 Auction ${auctionId} reached end time!`);
      await endAuctionAndNotifyWinner(auctionId);
    } catch (err) {
      console.error("Error ending auction:", err);
    }
  });
};
