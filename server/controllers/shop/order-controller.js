const razorpay = require("../../helpers/razorpay");
const Order = require("../../models/Order");
const Cart = require("../../models/Cart");
const Product = require("../../models/Product");

const createOrder = async (req, res) => {
    console.log(" /api/shop/order/create called with:", req.body);
    try {
        const {
            userId,
            cartItems,
            addressInfo,
            orderStatus,
            paymentMethod,
            paymentStatus,
            totalAmount,
            orderDate,
            orderUpdateDate,
            cartId,
        } = req.body;
        console.log(req.body, "sdfghjk");

        // 1️⃣ Create Razorpay order
        const options = {
            amount: totalAmount * 100, // Amount in paisa
            currency: "INR",
            receipt: `receipt_order_${Math.floor(Math.random() * 10000)}`,
        };

        const razorpayOrder = await razorpay.orders.create(options);
        console.log(razorpay, "asdfghjkl");

        // 2️⃣ Save order in DB (pending state)
        const newlyCreatedOrder = new Order({
            userId,
            cartId,
            cartItems,
            addressInfo,
            orderStatus: orderStatus || "pending",
            paymentMethod: paymentMethod || "razorpay",
            paymentStatus: paymentStatus || "unpaid",
            totalAmount,
            orderDate,
            orderUpdateDate,
            paymentId: razorpayOrder.id, // razorpay order id
        });

        console.log(newlyCreatedOrder);

        await newlyCreatedOrder.save();

        console.log(newlyCreatedOrder, "save");

        res.status(201).json({
            success: true,
            key: process.env.RAZORPAY_KEY_ID,
            order: razorpayOrder,
            orderId: newlyCreatedOrder._id,
        });
    } catch (error) {
        console.error("Error creating Razorpay order:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create Razorpay order",
        });
    }
};

const verifyPayment = async (req, res) => {
    try {
        const { orderId, razorpay_payment_id } = req.body;

        console.log(req.body, "verify");

        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }

        order.paymentStatus = "paid";
        order.orderStatus = "confirmed";
        order.paymentId = razorpay_payment_id;

        // reduce stock
        for (let item of order.cartItems) {
            const product = await Product.findById(item.productId);
            if (product) {
                product.totalStock -= item.quantity;
                await product.save();
            }
        }

        await Cart.findByIdAndDelete(order.cartId);
        await order.save();

        res.status(200).json({
            success: true,
            message: "Payment verified successfully",
            order,
        });
    } catch (error) {
        console.error("Error verifying payment:", error);
        res.status(500).json({
            success: false,
            message: "Payment verification failed",
        });
    }
};

module.exports = {
    createOrder,
    verifyPayment,
};
