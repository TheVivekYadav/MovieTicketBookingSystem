import mongoose, { Schema } from "mongoose";

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Movie title is required']
  },
  description: {
    type: String,
    required: true
  },
  genre: {
    type: [String],
    required: true,
    validate: [arr => arr.length > 0, 'At least one genre is required']
  },
  language: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true,
    min: [1, 'Duration must be at least 1 minute']
  },
  releaseDate: {
    type: Date,
    required: [true, "Release Date is not present"]
  },
  posterUrl: {
    type: String,
    required: true
  }
}, { timestamps: true });

export const Movies = mongoose.model("Movie", movieSchema);
