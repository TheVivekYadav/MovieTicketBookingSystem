import {Bookings} from "../models/bookings.models.js";
import {Show} from "../models/shows.models.js";
import { asyncHandler } from "../../utils/async-handler.js";
import {
  sendMail,
  emailConfirmationMailGenContent,
} from "../../utils/mail.js";
import Razorpay from "razorpay";
import razorpay from "../../utils/razorpayInstance.js";
import mongoose from 'mongoose'

// create order an booking of movie ticket
export const createBooking = asyncHandler(async (req, res) => {
  const MAX_RETRIES = 3;
  let retryCount = 0;
  let bookingResult;

  while (retryCount < MAX_RETRIES) {
    const session = await mongoose.startSession();
    try {
      session.startTransaction({
        readConcern: { level: 'snapshot' },
        writeConcern: { w: 'majority' },
      });

      const { showId, seats } = req.body;
      const user = req.user;
      const show = await Show.findOneAndUpdate(
        {
          _id: showId,
          bookedSeats: { $not: { $elemMatch: { $in: seats } } }
        },
        { $push: { bookedSeats: { $each: seats } } },
        { new: true, session }
      );

      if (!show) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({
          success: false,
          message: "One or more seats are already booked"
        });
      }

      const amount = seats.length * show.price * 100;
      const options = {
        amount,
        currency: "INR",
        receipt: `receipt_${Date.now()}`
      };

      const order = await razorpay.orders.create(options);

      const booking = await Bookings.create([{
        user,
        show: showId,
        seats,
        ticketPrice: show.price,
        totalAmount: amount,
        orderId: order.id
      }], { session });

      await session.commitTransaction();
      session.endSession();

      // send confirmation email
      sendMail({
        email: "bookingconfirm@gmail.com",
        subject: "Booking Confirmation",
        mailGenContent: emailConfirmationMailGenContent("Username", `${booking}`)
      });

      bookingResult = booking[0];

      return res.status(201).json({
        success: true,
        message: "Booking successful",
        booking: bookingResult,
        order
      });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();

      if (
        error.message &&
        error.message.includes("Write conflict")
      ) {
        retryCount++;
        if (retryCount === MAX_RETRIES) {
          return res.status(500).json({
            success: false,
            message: "Booking failed due to high demand. Please try again."
          });
        }
      } else {
        return res.status(500).json({ message: error.message });
      }
    }
  }
});


export const getMyBookings = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const bookings = await Bookings.find({ user: userId });
    res.json({ success: true, bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});
export const cancelBooking = async (req, res) => {
  const { id } = req.params;

  try {
    const booking = await Bookings.findById(id);

     if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    if (booking.paymentStatus == 'cancelled') {
      return res.status(404).json({ success: false, message: "Booking already cancelled" });
    }


    // Mark booking as cancelled (recommended over deleting)
    booking.paymentStatus = 'cancelled';
    await booking.save();


    const show = await Show.findById(booking.show);
    if (show) {
      show.bookedSeats = show.bookedSeats.filter(seat => !booking.seats.includes(seat));
      await show.save();
    }

    return res.status(200).json({ success: true, message: "Booking cancelled and seats freed successfully", booking });
  } catch (err) {
    console.error("Cancel booking error:", err);
    return res.status(500).json({ success: false, message: "Server error while cancelling booking" });
  }
};
