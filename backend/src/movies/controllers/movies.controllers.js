import { asyncHandler } from "../../utils/async-handler.js";
import { ApiResponse } from "../../utils/api-response.js";
import { Movies } from "../models/movies.models.js";

export const getAllMovies = asyncHandler(async (req, res) => {
  try {
    const movies = await Movies.find();
    res.status(200).json({ movies });
  } catch (err) {
    res.status(500).json( new ApiResponse(200, { message: err.message }));
  }
});

export const addMovies = asyncHandler(async (req, res) => {

  try{
  const { title, description, duration, releaseDate, genre, language ,posterUrl} = req.body;
  
  const movie = await Movies.create({
      title,
      description,
      duration,
      releaseDate,
      genre,
      language,
      posterUrl,
    });
 
  return res.status(200).json(new ApiResponse(200, {message: "Movie added Successfully"}))
  }catch(e){
    return res.status(400).json(new ApiResponse(400, {message: `${e}`}))
  }
});

export const getMovieById = asyncHandler(async (req, res) => {
  try {
    const movie = await Movies.findById(req.params.id);
    if (!movie) return res.status(404).json(new ApiResponse({ message: "Movie not found" }));

    res.status(200).json(new ApiResponse(200,{message: movie }));
  } catch (err) {
    res.status(500).json(new ApiResponse(500,{ message: err.message }));
  }
});

export const updateMovie = asyncHandler( async (req, res) => {
  try {
    const updated = await Movies.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!updated) return res.status(404).json({ message: "Movie not found" });

    res.status(200).json(new ApiResponse(200,{ message: `Movie updated `,movie:updated}));
  } catch (err) {
    res.status(500).json(new ApiResponse(500, { message: err.message }));
  }
});

export const deleteMovie = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const movie = await Movies.findByIdAndDelete(id);

    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    res.status(200).json({
      message: "Movie deleted successfully",
      deletedMovie: movie,
    });
  } catch (error) {
    res.status(500).json({ message: "Error deleting movie", error: error.message });
  }
});
