const express = require("express");
const router = express.Router();

const verifyToken = require("../controllers/authMiddleware");

const {
  createOrder,
  getOrdersByUserId,
  getAllOrders,
  updateOrderStatus,
} = require("../controllers/OrderController");

router.use(verifyToken);

router.post("/create-order", createOrder);
router.get("/user-orders", getOrdersByUserId);
router.get("/all-orders", getAllOrders);
router.patch("/update-order", updateOrderStatus);

module.exports = router;
