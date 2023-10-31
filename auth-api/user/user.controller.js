import express from "express";
import UserService from "./user.service.js";
import {checkTokenMiddleware} from "../middleware/auth.middleware.js";

const userController = express.Router();

// userController.get('/all', UserService.getAllUsers);
userController.get('/me', checkTokenMiddleware, UserService.getUser);


export default userController;