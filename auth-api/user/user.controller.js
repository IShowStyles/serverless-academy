import express from "express";
import UserService from "./user.service.js";
import {checkTokenMiddleware} from "../middleware/bearer.middleware.js";

const userController = express.Router();

userController.get('/all', UserService.getAllUsers);
userController.get('/bearer', checkTokenMiddleware, UserService.getUser);


export default userController;