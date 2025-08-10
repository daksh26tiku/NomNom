const Product = require("../models/ProductModel");
const User = require("../models/UserModel");
const Order = require("../models/OrderModel");

const createOrder = async (req, res) => {
  const userId = req.user.id;
  try {
    const {
      phoneNumber,
      address,
      items,
      subtotal,
      deliveryCharge,
      totalAmount,
      paymentMethod,
      orderStatus,
    } = req.body;

    // Adjust stock quantities for each product
    for (const item of items) {
      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product with ID ${item.productId} not found`,
        });
      }

      if (product.quantityInStock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for product ${product.name}`,
        });
      }

      product.quantityInStock -= item.quantity;
      await product.save();
    }

    // Create new order
    const newOrder = new Order({
      userId,
      phoneNumber,
      address,
      items,
      subtotal,
      deliveryCharge,
      totalAmount,
      paymentMethod,
      orderStatus,
    });

    await newOrder.save();

    res.status(200).json({
      success: true,
      message: "Order created successfully",
      data: newOrder,
    });
  } catch (error) {
    console.error("Error creating order:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const getOrdersByUserId = async (req, res) => {
  const userId = req.user.id;
  try {
    const orders = await Order.find({ userId: userId })
      .populate({
        path: "items.productId",
      })
      .sort({ createdAt: -1 });

    if (!orders) {
      res.status(500).json({
        success: false,
        message: "Couldn't get orders",
      });
    }
    res.status(200).json({
      success: true,
      message: "Orders successfully fetched!",
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate({
        path: "items.productId",
      })
      .sort({ createdAt: -1 })
      .populate({
        path: "userId",
        select:
          "-password -email -bio -role -bookmarks -userLikeCount -creditPoints -createdAt -updatedAt",
      });

    if (!orders) {
      res.status(500).json({
        success: false,
        message: "Couldn't get orders",
      });
    }
    res.status(200).json({
      success: true,
      message: "Orders successfully fetched!",
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const updateOrderStatus = async (req, res) => {
  const { orderId, status } = req.body;
  try {
    const order = await Order.findById(orderId);

    if (!order) {
      res.status(500).json({
        success: false,
        message: "Couldn't get order",
      });
    }

    order.orderStatus = status;
    await order.save();

    res.status(200).json({
      success: true,
      message: "Orders successfully fetched!",
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// const AdminInfo = async (req, res) => {

//   try {
//     const orders = await Order.countDocuments()
//     const recipes = await Order.countDocuments()
//     const users = await Order.countDocuments()

//     if (!order) {
//       res.status(500).json({
//         success: false,
//         message: "Couldn't get order",
//       });
//     }

//     order.orderStatus = status;
//     await order.save();

//     res.status(200).json({
//       success: true,
//       message: "Orders successfully fetched!",
//       data: order,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Server error",
//       error: error.message,
//     });
//   }
// };

module.exports = {
  createOrder,
  getOrdersByUserId,
  getAllOrders,
  updateOrderStatus,
};
