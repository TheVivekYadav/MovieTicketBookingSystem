import {Show} from "../models/shows.models.js";
import {Movies} from "../models/movies.models.js"
import {Cinema} from "../models/cinema.models.js";

import { asyncHandler } from "../../utils/async-handler.js";


export const createShow = async (req, res) => {
  try {
const { movie, cinema, screen, showTime, price } = req.body;

        // Check if all required fields are present
    if (!movie || !cinema || !screen || !showTime) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }
        // Optional: Validate references exist
    const movieExists = await Movies.findById(movie);
    const cinemaExists = await Cinema.findById(cinema);
    const screenExists = cinemaExists?.screens?.some(s => s._id.toString() === screen);

     if (!movieExists || !cinemaExists || !screenExists) {
      return res.status(404).json({ success: false, message: 'Invalid movie, cinema or screen ID' });
    }

    const show = await Show.create({
      movie,
      cinema,
      screen,
      showTime,
      bookedSeats: [],// default
      price
    });
    res.status(201).json({ success: true, show });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// TODO: modify this controller
// get show by movie id and cinema id
export const getShowsByMovieOrCinema = asyncHandler(async (req, res) => {
  try {
    const { movieId, cinemaId } = req.query;
    const query = {};
    if (movieId) query.movie = movieId;
    if (cinemaId) query.cinema = cinemaId;

    const shows = await Show.find(query)
      .populate("movie")
      .populate("cinema");

    res.status(200).json({ success: true, shows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
export const getAllShows = async (req, res) => {
  try {
    const shows = await Show.find()
      .populate("movie")
      .populate("cinema");

    res.status(200).json({ success: true, shows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
export const deleteShow = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const deletedShow = await Show.findByIdAndDelete(id);

    if (!deletedShow) {
      return res.status(404).json({
        success: false,
        message: "Show not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Show deleted successfully",
      data: deletedShow,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong while deleting the show",
      error: error.message,
    });
  }
});

