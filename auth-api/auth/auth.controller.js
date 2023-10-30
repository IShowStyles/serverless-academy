import express from "express";
import {AuthService} from "./auth.service.js";
import {bearerMiddleware} from "../middleware/bearer.middleware.js";

const authController = express.Router();


authController.post("/login", bearerMiddleware, (req, res) => {

});

authController.post("/register", AuthService.register);
export default authController;