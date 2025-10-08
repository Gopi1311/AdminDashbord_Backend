const express = require("express");
const router = express.Router();
const {
  getOrders,
  orderTracking,
  notifyMessage,
} = require("../controller/OrderedController");

router.get("/orders", getOrders);
router.get("/ordertrack/:userId", orderTracking);
router.get("/notify", notifyMessage);
module.exports = router;
