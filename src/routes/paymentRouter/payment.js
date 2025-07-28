const express = require("express");
const { userAuth } = require("../../middleware/auth");
const paymentRouter = express.Router();
const razorpayInstance = require("../../utils/razorpay");
const PaymentModel = require("../../models/Payment");
const { membershipAmount } = require("../../utils/constent");
const {
  validateWebhookSignature,
} = require("razorpay/dist/utils/razorpay-utils");
const User = require("../../models/User");

//Create Order
paymentRouter.post("/create-order", userAuth, async (req, res) => {
  try {
    const { membershipType } = req.body;
    const { firstName, emailId, _id: userId } = req.user;

    const order = await razorpayInstance.orders.create({
      amount: membershipAmount[membershipType] * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        firstName,
        emailId,
        membershipType: membershipType,
      },
    });
    console.log(order);
    //Save it in database
    const payment = new PaymentModel({
      userId,
      orderId: order.id,
      status: order.status,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      notes: order.notes,
    });
    const savedPayments = await payment.save();
    res
      .status(200)
      .json({ ...savedPayments.toJSON(), keyId: process.env.RAZORPAY_KEY_ID });
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
});

//Verify Payment
paymentRouter.post("/webhook", async (req, res) => {
  try {
    const webhookSignature = req.get("X-Razorpay-Signature");
    const isWebHookVaild = await validateWebhookSignature(
      JSON.stringify(req.body),
      webhookSignature,
      process.env.RAZORPAY_WEBHOOK_SECRET_KEY
    );
    if (!isWebHookVaild) {
      return res.status(400).json({ message: "Webhook signature is invaild!" });
    }
    //Update the payment status in DB
    const paymentDetails = req.body.payload.payment.entity;
    const payment = await PaymentModel.findOne({
      orderId: paymentDetails.order_id,
    });
    payment.status = paymentDetails.status;
    await payment.save();

    //Update the user as premium
    const user = await User.findOne({ _id: payment.userId });
    user.isPremium = true;
    user.membershipType = payment.notes.membershipType;
    await user.save();

    // if (req.body.event === "payment.captured") {
    // }
    // if (req.body.event === "payment.failed") {
    // }

    //return success response to razorpay
    return res.status(200).json({ message: "Webhook recevied successfully!" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

//Payment Status
paymentRouter.get("/premium/verify", userAuth, async (req, res) => {
  const user = req.user.toJSON();
  console.log(user);
  if (user.isPremium) {
    return res.status(200).json({ ...user });
  }
  return res.json({ ...user });
});
module.exports = paymentRouter;
