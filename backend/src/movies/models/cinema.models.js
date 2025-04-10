import mongoose, { Schema } from "mongoose";

const screenSchema = new mongoose.Schema({
  screenNumber: { type: Number, required: true },
  totalRows: {type: Number, required: true},
  seatsPerRow: { type: Number, required: true },
  screenType: { type: String, default: "2D" }
});

const cinemaSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  totalSeats: {
    type: Number,
    required: true,
    min: 1,
  },
  screens: [screenSchema] 
}, { timestamps: true });

export const Cinema = mongoose.model("Cinema", cinemaSchema);


