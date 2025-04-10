import crypto from "crypto";
import {getOrderStatusById} from "../../utils/getOrderStatus.js"
import {Bookings} from "../../movies/models/bookings.models.js"; 

export const handlePayment =async (req, res) => {
  const { orderId } = req.params;
  if (!orderId) {
    return res.status(400).json({
      success: false,
      message: "Order ID is missing in params",
    });
  }

  try {
    const {order} = await getOrderStatusById(orderId); // assuming this fetches the order

    res.status(200).json({
      success: true,
      order: {
        id: orderId,
        details: order,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Payment failed",
      error: error.message,
    });
  }
};


export const verifyPayment = async (req, res) => {

  try{
  const { 
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature 
  } = req.body;

  
  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest("hex");

  const isValid = expectedSignature === razorpay_signature;

  if (isValid) {
    // ✅ Save in DB that payment is successful
    const razorpayOrder = await getOrderStatusById(razorpay_order_id);
    const updatedBooking = await Bookings.findOneAndUpdate(
          { orderId: razorpay_order_id },
          {
            $set: {
              paymentStatus: razorpayOrder.status, // Razorpay returns 'created', 'paid', etc.
              razorpay_payment_id,
              razorpay_signature,
              updatedAt: new Date(),
            },
          },
          { new: true }
        );
    
    res.status(200).json({ success: true, message: "Payment Successful" });
    }}
    catch(e){

    res.status(400).json({ success: false, message: `${e}`  });
    }
};

export const getOrderStatus = async (req, res) => {

  const { orderId } = req.params;
  try {
const order = await getOrderStatusById(orderId);
    return res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch order",
      error: error.message
    });
  }
};


