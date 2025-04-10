import jwt from "jsonwebtoken"
import { ApiResponse } from "../../utils/api-response.js"

export const isLoggedIn = (req, res, next) => {
  const token = req.cookies.accessToken;

  if(!token) return res.status(401).json(new ApiResponse(401, {message: "Unauthorized"}));
  try{
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded;
    next();
  }catch(e){
    return res.status(401).json(new ApiResponse(401, {message: "Invalid token"}))
  }
};


// middleware/authorizeRoles.js

export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json(new ApiResponse(403, { message: "Forbidden: Access denied" }));
    }
    next();
  };
};