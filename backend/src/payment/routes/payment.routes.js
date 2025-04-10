import {Router} from "express";
import { handlePayment,verifyPayment ,getOrderStatus } from "../controllers/paymentOrder.controller.js";
import { isLoggedIn } from "../../auth/middlewares/isLoggedIn.middleware.js";

const router = Router();


router.route("/pay/:orderId").post(handlePayment);// we can use isLoggedIn during payment 
router.route("/verify").post(verifyPayment);
router.route("/order/:orderId/status").get(isLoggedIn,getOrderStatus);

export default router;

