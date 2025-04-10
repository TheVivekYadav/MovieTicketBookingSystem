import {asyncHandler} from "../../utils/async-handler.js";
import {ApiResponse} from "../../utils/api-response.js";
import {Cinema} from "../models/cinema.models.js";

// Create a new cinema
export const createCinema = asyncHandler(async (req, res) => {
  try {
    const cinema = await Cinema.create(req.body);
    res.status(201).json({ success: true, cinema });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all cinemas
export const getAllCinemas = asyncHandler(async (req, res) => {
  try {
    const cinemas = await Cinema.find();
    res.status(200).json({ success: true, cinemas });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get single cinema by ID
export const getCinemaById = asyncHandler(async (req, res) => {
  try {
    const cinema = await Cinema.findById(req.params.id);
    if (!cinema) {
      return res.status(404).json({ success: false, message: "Cinema not found" });
    }
    res.status(200).json({ success: true, cinema });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update cinema
export const updateCinema = asyncHandler(async (req, res) => {
  try {
    const updatedCinema = await Cinema.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedCinema) {
      return res.status(404).json({ success: false, message: "Cinema not found" });
    }
    res.status(200).json({ success: true, cinema: updatedCinema });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

//Get no. of screens in a cinema based on id of cinema
export const getScreensOfCinema = async (req, res) => {
  try {
    const cinema = await Cinema.findById(req.params.id);
    if (!cinema) {
      return res.status(404).json({ success: false, message: "Cinema not found" });
    }

    res.status(200).json({ success: true, screens: cinema.screens });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete cinema
export const deleteCinema = asyncHandler(async (req, res) => {
  try {
    const cinema = await Cinema.findByIdAndDelete(req.params.id);
    if (!cinema) {
      return res.status(404).json({ success: false, message: "Cinema not found" });
    }
    res.status(200).json({ success: true, message: "Cinema deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

