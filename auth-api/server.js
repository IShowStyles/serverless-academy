import express from 'express';
import Pool from './db/index.js';
import auth from './auth/auth.controller.js';
import user from './user/user.controller.js';
import {checkTokenMiddleware} from "./middleware/auth.middleware.js";
import UserService from "./user/user.service.js";

export const db = await Pool.init();
const app = express();
app.use(express.json({
  extended: true,
}));

app.disable('x-powered-by');
app.use("/auth", auth);
app.get('/me', checkTokenMiddleware, UserService.getUser);



export default app;