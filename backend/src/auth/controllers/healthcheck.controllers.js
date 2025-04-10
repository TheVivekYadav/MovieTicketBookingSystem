import { ApiResponse } from "../../utils/api-response.js";
import connectDB from "../db/index.js";

const healthCheck = (req, res) => {
  //console.log("logic to connect with db");
  connectDB()
  
  res.status(200).json(new ApiResponse(200, { message: "Server is running" }));
};

export { healthCheck };
