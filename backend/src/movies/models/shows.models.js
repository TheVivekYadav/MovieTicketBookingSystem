import mongoose from "mongoose";

const showSchema = new mongoose.Schema({
  movie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Movie",
    required: true,
  },
  cinema: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cinema",
    required: true,
  },
  screen: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cinema.screens',
    required: true,
  },
  showTime: {
    type: Date,
    required: true,
  },
  bookedSeats: {
    type: [String],
    default: [],
  },
  price: {
    type: Number,
    required: true,
  }
}, { timestamps: true });

export const Show = mongoose.model("Show", showSchema);

