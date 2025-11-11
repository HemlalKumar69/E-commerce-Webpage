const Razorpay = require("razorpay");
const crypto = require("crypto");

// 👇 Razorpay instance setup (use your real/test keys)
const razorpayInstance = new Razorpay({
  key_id: "rzp_test_Rbdj8WrNdv5dOL", // Replace with your Razorpay Key ID
  key_secret: "VMmSHN3EZ60Bq5XEJ0kzJ59p", // Replace with your Razorpay Secret Key
});

// ✅ Create Razorpay order
exports.createOrder = async (req, res) => {
  try {
    const options = {
      amount: req.body.totalAmount * 100, // Convert to paisa
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Create Order Error:", error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

// ✅ Verify Razorpay payment
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", razorpayInstance.key_secret)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      res.status(200).json({ success: true, message: "Payment verified successfully" });
    } else {
      res.status(400).json({ success: false, message: "Invalid signature sent!" });
    }
  } catch (error) {
    console.error("Verify Payment Error:", error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};


