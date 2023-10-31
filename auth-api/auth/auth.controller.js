import express from "express";
import AuthService from "./auth.service.js";
import {authMiddleware} from "../middleware/auth.middleware.js";

const authController = express.Router();
authController.post("/sign-in", authMiddleware, AuthService.login);
authController.post("/sign-up", AuthService.register);
export default authController;