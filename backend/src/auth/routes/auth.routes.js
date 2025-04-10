import { Router } from "express";
import {
  registerUser,
  loginUser,
  verifyEmail,
  getCurrentUser,
  logoutUser,
  changeCurrentPassword,
} from "../controllers/auth.controllers.js";
import { validate } from "../middlewares/validator.middleware.js";
import { userRegistrationValidator } from "../validators/index.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.middleware.js";


const router = Router();

router.route("/register")
  .post(userRegistrationValidator(), validate, registerUser);
router.route("/verify/:token").get(verifyEmail);
router.route("/login").post(loginUser);
router.route("/me").get(isLoggedIn, getCurrentUser);
router.route("/logout").post(isLoggedIn, logoutUser);
router.route("/resetpassword").post(isLoggedIn, changeCurrentPassword);

export default router;
