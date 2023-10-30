import express from 'express';
import auth from './auth/auth.controller.js';

const app = express();

app.use(express.json({
  extended: true,
}));

app.disable('x-powered-by');
const api = express.Router();
api.use("/auth", auth);
app.use("/api", api);

export default app;