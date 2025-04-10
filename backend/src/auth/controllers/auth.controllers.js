import { asyncHandler } from "../../utils/async-handler.js";
import { ApiResponse } from "../../utils/api-response.js";
import { User } from "../models/user.models.js";
import {
  sendMail,
  emailVerificationMailGenContent,
} from "../../utils/mail.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";

const registerUser = asyncHandler(async (req, res) => {
  const { email, username, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ email });


    if (existingUser) {
      return res.status(400).json(new ApiResponse(400, { message: "user already exists" }));
    }
    const user = await User.create({
      username,
      email,
      password,
      role
    });

    if (!user) {
      return res.status(400).json(new ApiResponse(200, { message: "user registration failed" }))
    }




    const { unHashedToken, hashedToken, tokenExpiry } = user.generateTemporaryToken();


    user.emailVerificationToken = hashedToken;
    user.emailVerificationExpiry = tokenExpiry;
    await user.save();


    //Send Email to user so that he can verify 
    sendMail({
      email: 'exampple@example.com',
      subject: 'Subject of email',
      mailGenContent: emailVerificationMailGenContent(username, `http://localhost:8000/api/v1/auth/verify/${unHashedToken}`)
    });




  } catch (e) {
    return res.status(400).json(new ApiResponse(400, { message: e }))
  }

  return res.status(200).json(new ApiResponse(200, { message: "registered user successfully" }))

});


const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json(new ApiResponse(400, { message: "1.Invalid username or password" }));

    user.isPasswordCorrect(password).then(isMatch => {
      if (isMatch) {
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        user.refreshToken = refreshToken;
        user.save();

        const accessCookieOptions = {
          httpOnly: false,
          secure: false,
          maxAge: 15 * 60 * 1000,
        }

        const refreshCookieOptions = {
          httpOnly: false,
          secure: false,
          maxAge: 7 * 24 * 60 * 60 * 1000,
        }



        res.cookie("accessToken", accessToken, accessCookieOptions);
        res.cookie("refreshToken", refreshToken, refreshCookieOptions)
        return res.status(200).json(new ApiResponse(200, { message: "User LogedIn" }));
      } else {
        return res.status(400).json(new ApiResponse(400, { message: "2.Invalid username or password" }));
      }
    }
    ).catch((e) =>
      res.status(400).json(new ApiResponse(400, { message: `${e}` }
      )))


  }
  catch (e) {
    return res.status(400).json(new ApiResponse(400, { message: `${e}` }));
  }


});


const logoutUser = asyncHandler(async (req, res) => {
  const { email, username, password, role } = req.body;



  res.clearCookie('accessToken', {
    httpOnly: false,
  });
  res.clearCookie('refreshToken',{
    httpOnly: false,
  })

  return res.status(200).json(new ApiResponse(200, { message: req.user }));

});



const verifyEmail = asyncHandler(async (req, res) => {

  const { token } = req.params;

  const currentTime = Date.now();


  const hashedToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");


  if (!token) return res.status(400).json(new ApiResponse(400, { message: "Inavlid Token" }));

  const user = await User.findOne({ emailVerificationToken: hashedToken });



  if (!user) return res.status(400).json(new ApiResponse(400, { message: "Invalid Token" }));


  if (user.emailVerificationExpiry < currentTime) {
    return res.status(400).json(400, { message: "Time out" });
  }
  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;

  await user.save();

  return res.status(200).json(new ApiResponse(200, { message: "Email verified" }))

});


const resendEmailVerification = asyncHandler(async (req, res) => {
  const { email, username, password, role } = req.body;
  try {

    const user = await User.findOne({ email });
    const { unHashedToken, hashedToken, tokenExpiry } = user.generateTemporaryToken();


    user.emailVerificationToken = hashedToken;
    user.emailVerificationExpiry = tokenExpiry;
    await user.save();


    //Send Email to user so that he can verify 
    sendMail({
      email: 'exampple@example.com',
      subject: 'Subject of email',
      mailGenContent: emailVerificationMailGenContent(username, `http://localhost:8000/api/v1/auth/verify/${unHashedToken}`)
    });
    res.status(200).json(new ApiResponse(200, { message: `Email has been sent` }))
  } catch (e) {
    res.status(500).json(new ApiResponse(500, { message: `${e}` }));
  }

});



const refreshAccessToken = asyncHandler(async (req, res) => {
  const { email, username, password, role } = req.body;

  const user = User.findOne({ email });

});

/*
const forgotPasswordRequest = asyncHandler(async (req, res) => {

  const { email } = req.body;

  if (!email) {
    return res
      .status(400)
      .json(new ApiResponse(400, { message: "Email is required" }));
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res
      .status(404)
      .json(new ApiResponse(404, { message: "User not found" }));
  }

  // Generate reset token
  const resetToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

  // Set token and expiry on user
  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpires = Date.now() + 1000 * 60 * 10; // 10 minutes
  await user.save();

  // Create reset URL
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  // Send email
  await sendMail({
    email: user.email,
    subject: "Password Reset Request",
    mailGenContent: `Click here to reset your password: <a href="${resetUrl}">${resetUrl}</a>`,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, { message: "Reset email sent successfully" }));


});
*/

const changeCurrentPassword = asyncHandler(async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json(new ApiResponse(400, { message: "Both current and new passwords are required" }));
    }

    const user = await User.findById(req.user._id).select("+password");
    if (!user) {
      return res.status(404).json(new ApiResponse(404, { message: "User not found" }));
    }

    const isMatch = user.isPasswordCorrect(currentPassword);
    if (!isMatch) {
      return res.status(401).json(new ApiResponse(401, { message: "Incorrect current password" }));
    }

    user.password = newPassword; // Will be hashed by pre-save middleware
    await user.save();

    res.status(200).json(new ApiResponse(200, { message: "Password changed successfully" }));
  } catch (error) {
    res.status(500).json(new ApiResponse(500, { message: error.message }));
  }

});



const getCurrentUser = asyncHandler(async (req, res) => {

  try {
    return res.status(200).json(new ApiResponse(200, { message: req.user }));
  } catch (e) {
    return res.status(400).json(new ApiResponse(400, { message: `${e}` }))
  }

});




export { registerUser, verifyEmail, loginUser, getCurrentUser, logoutUser, resendEmailVerification, changeCurrentPassword };
