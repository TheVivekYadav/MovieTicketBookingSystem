import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

//router imports
import healthCheckRouter from "./auth/routes/healthcheck.routes.js"
import authUser from "./auth/routes/auth.routes.js"
import movies from "./movies/routes/movies.routes.js";
import payment from "./payment/routes/payment.routes.js"; 

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "../frontend")));


app.use("/api/v1/healthcheck", healthCheckRouter)
app.use("/api/v1/auth", authUser)
app.use("/api/v1/", movies)
app.use("/api/v1/payment", payment)


app.get("/pay?:orderId", (req, res) => {
  res.sendFile(path.join(__dirname, "../../frontend/app.html"));
});
/*
app.post("/api/v1/payment/pay/:orderId", (req, res) => {
  res.sendFile(path.join(__dirname, "../../frontend/app.html"));
});
*/
app.get("/home", (req, res) => {
  res.sendFile(path.join(__dirname, "../../frontend/"))
})

export default app;
