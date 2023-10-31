import {AuthDTO} from "./auth.dto.js";
import Pool from "../db/index.js";
import {ConflictException} from "../exceptions/all.exceptions.js";
import jwt from "jsonwebtoken";
import {InsertQuery, SelectQuery, UpdateQuery} from "../queries/index.js";


class AuthService {
  constructor() {
  }

  async login(req, res) {
    const {email, password} = req.body;
    const user = await Pool.queries(SelectQuery('users', {email: email}));
    try {
      if (user.email !== email) {
        throw new ConflictException('Email doesnt exists');
      }
      const accessToken = jwt.sign({
        email: user.email,
        username: user.username,
        password: password,
      }, process.env.ACCESS_TOKEN_SECRET, {expiresIn: process.env.EXPIRES_IN || '1h'});

      const saved = await Pool.queries(...UpdateQuery('users', {
        accessToken: accessToken,
      }, {email: email}));

      return res.status(200).json({
        success: true,
        date: {
          id: user.id,
          accessToken: accessToken,
          refreshToken: user.refreshtoken,
        }
      });
    } catch (e) {
      return res.status(404).json({
        success: false,
        message: e.message
      })
    }
  }

  async register(req, res) {
    const {username, email, password, error} = new AuthDTO(req.body);
    try {
      if (error.length) {
        throw new Error(error.join(' | '));
      }
      const userEmail = await Pool.queries(`Select email,username from users`);
      if (userEmail?.email === email) {
        throw new ConflictException('Email already exists');
      }
      if (userEmail?.username === username) {
        throw new ConflictException('Username already exists');
      }
      const accessToken = jwt.sign({username, email, password}, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.EXPIRES_IN || '1h'
      });
      const refreshToken = jwt.sign({username, email, password}, process.env.REFRESH_TOKEN_SECRET);
      const user = await Pool.queries(...InsertQuery('users', {
        username: username,
        email: email,
        accessToken: accessToken,
        refreshToken: refreshToken,
      }));
      return res.status(201).json({
        success: true,
        date: {
          id: user.id,
          accessToken: accessToken,
          refreshToken: refreshToken,
        }
      });
    } catch (e) {
      res.status(404).json({
        success: false,
        message: e.message
      })
    }
  }
}


export default new AuthService();