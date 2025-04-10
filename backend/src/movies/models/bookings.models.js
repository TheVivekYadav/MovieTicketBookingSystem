import mongoose, { Schema } from "mongoose";

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  show: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Show',
    required: true
  },
  seats: {
    type: [String],
    required: true,
  },
  paymentStatus:{
    type: String,
    enum: ["pending", "paid", "failed", "cancelled"],
    default: "pending",
  },
  ticketPrice: {
  type: Number,
  required: true
},
totalAmount: {
  type: Number,
  required: true
},
  paymentId:{
    type: String,
  },
  orderId: {
    type: String
  }
}, { timestamps: true });

export const Bookings = mongoose.model("Bookings", bookingSchema);
