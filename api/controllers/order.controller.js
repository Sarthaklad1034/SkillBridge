// import createError from "../utils/createError.js";
// import Order from "../models/order.model.js";
// import Gig from "../models/gig.model.js";
// import Stripe from "stripe";
// export const intent = async(req, res, next) => {
//     const stripe = new Stripe(process.env.STRIPE);

//     const gig = await Gig.findById(req.params.id);

//     const paymentIntent = await stripe.paymentIntents.create({
//         amount: gig.price * 100,
//         currency: "usd",
//         automatic_payment_methods: {
//             enabled: true,
//         },
//     });

//     const newOrder = new Order({
//         gigId: gig._id,
//         img: gig.cover,
//         title: gig.title,
//         buyerId: req.userId,
//         sellerId: gig.userId,
//         price: gig.price,
//         payment_intent: paymentIntent.id,
//     });

//     await newOrder.save();

//     res.status(200).send({
//         clientSecret: paymentIntent.client_secret,
//     });
// };

// export const getOrders = async(req, res, next) => {
//     try {
//         const orders = await Order.find({
//             ...(req.isSeller ? { sellerId: req.userId } : { buyerId: req.userId }),
//             isCompleted: true,
//         });

//         res.status(200).send(orders);
//     } catch (err) {
//         next(err);
//     }
// };
// export const confirm = async(req, res, next) => {
//     try {
//         const orders = await Order.findOneAndUpdate({
//             payment_intent: req.body.payment_intent,
//         }, {
//             $set: {
//                 isCompleted: true,
//             },
//         });

//         res.status(200).send("Order has been confirmed.");
//     } catch (err) {
//         next(err);
//     }
// };
import createError from "../utils/createError.js";
import Order from "../models/order.model.js";
import Gig from "../models/gig.model.js";
import Razorpay from "razorpay";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

export const createOrder = async(req, res, next) => {
    try {
        const gig = await Gig.findById(req.params.id);
        if (!gig) return next(createError(404, "Gig not found"));

        const options = {
            amount: gig.price * 100, // Razorpay amount is in paisa
            currency: "INR",
            receipt: `receipt_${Date.now()}`
        };

        const order = await razorpay.orders.create(options);

        const newOrder = new Order({
            gigId: gig._id,
            img: gig.cover,
            title: gig.title,
            buyerId: req.userId,
            sellerId: gig.userId,
            price: gig.price,
            payment_intent: order.id,
        });

        await newOrder.save();

        res.status(200).json({
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            keyId: process.env.RAZORPAY_KEY_ID,
        });
    } catch (err) {
        next(err);
    }
};

export const getOrders = async(req, res, next) => {
    try {
        const orders = await Order.find({
            ...(req.isSeller ? { sellerId: req.userId } : { buyerId: req.userId }),
            isCompleted: true,
        });
        res.status(200).send(orders);
    } catch (err) {
        next(err);
    }
};

export const confirm = async(req, res, next) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest("hex");

        if (expectedSignature === razorpay_signature) {
            await Order.findOneAndUpdate({ payment_intent: razorpay_order_id }, { $set: { isCompleted: true } });
            res.status(200).send("Payment verified and order has been confirmed.");
        } else {
            res.status(400).send("Invalid signature");
        }
    } catch (err) {
        next(err);
    }
};