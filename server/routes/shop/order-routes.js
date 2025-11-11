const express = require("express");
const router = express.Router();
const {
  createOrder,
  verifyPayment,
} = require("../../controllers/shop/order-controller");

router.post("/create", createOrder);
router.post("/verify-payment", verifyPayment);
// router.get("/", getOrders);
// router.get("/:id", getOrderById);

module.exports = router;
