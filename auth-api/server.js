import express from 'express';
import Pool from './db/index.js';
import auth from './auth/auth.controller.js';
import user from './user/user.controller.js';

export const db = await Pool.init();
const app = express();
app.use(express.json({
  extended: true,
}));

app.disable('x-powered-by');
const api = express.Router();
api.use("/auth", auth);
api.use("/users", user);
app.use("/api", api);
app.get('/api/', (req, res) => {
  res.send('Hello World!');
})

export default app;