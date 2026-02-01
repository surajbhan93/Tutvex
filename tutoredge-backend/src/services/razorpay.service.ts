import Razorpay from "razorpay";

if (!process.env.RAZORPAY_KEY || !process.env.RAZORPAY_SECRET) {
  throw new Error("Razorpay env variables are missing");
}

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY,        // ✅ FIX
  key_secret: process.env.RAZORPAY_SECRET, // ✅ FIX
});

export default razorpay;
