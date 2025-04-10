import razorpay from "./razorpayInstance.js";

export const getOrderStatusById = async (orderId) => {
    const order = await razorpay.orders.fetch(orderId);
    return order;
};
