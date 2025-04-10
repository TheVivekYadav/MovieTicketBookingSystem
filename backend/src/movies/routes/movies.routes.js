import { Router } from "express";
import {
  addMovies,
  getAllMovies,
  getMovieById,
  updateMovie,
  deleteMovie,
} from "../controllers/movies.controllers.js";
import{
  createCinema,
  getAllCinemas,
  getCinemaById,
  updateCinema,
  deleteCinema,
  getScreensOfCinema,
} from "../controllers/cinema.controllers.js"

import {
  createShow,
  getAllShows,
  getShowsByMovieOrCinema,
  deleteShow,
} from "../controllers/shows.controllers.js";

import { 
  createBooking,
  getMyBookings,
  cancelBooking,
} from "../controllers/booking.controllers.js";

import { authorizeRoles, isLoggedIn } from "../../auth/middlewares/isLoggedIn.middleware.js";
import { UserRolesEnum } from "../../utils/constants.js";

const router = Router();


router.route("/movie").post(isLoggedIn, authorizeRoles(UserRolesEnum.ADMIN),addMovies);
router.route("/movie").get(getAllMovies);
router.route("/movie/:id").get(getMovieById);
router.route("/movie/:id").put(isLoggedIn, authorizeRoles(UserRolesEnum.ADMIN),updateMovie)
router.route("/movie/:id").delete(isLoggedIn, authorizeRoles(UserRolesEnum.ADMIN), deleteMovie);

router.route("/cinema").post(isLoggedIn, authorizeRoles(UserRolesEnum.ADMIN),createCinema);
router.route("/cinema").get(getAllCinemas);
router.route("/cinema/:id").get(getCinemaById);
router.route("/cinema/:id").put(isLoggedIn, authorizeRoles(UserRolesEnum.ADMIN),updateCinema);
router.route("/cinema/:id").delete(isLoggedIn, authorizeRoles(UserRolesEnum.ADMIN),deleteCinema);
router.route("/cinema/:id/screens").get(getScreensOfCinema);
router.route("/shows/:id").delete(isLoggedIn, authorizeRoles(UserRolesEnum.ADMIN),deleteShow);

router.route("/shows").post(isLoggedIn, authorizeRoles(UserRolesEnum.ADMIN),createShow);
router.route("/shows").get(isLoggedIn,getAllShows);
router.route("/shows/filter").get(isLoggedIn,getShowsByMovieOrCinema);

router.route("/booking/create").post(isLoggedIn,createBooking);
router.route("/booking/me").get(isLoggedIn,getMyBookings);
router.route("/booking/cancel/:id").delete(isLoggedIn,cancelBooking);

export default router;
