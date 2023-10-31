import {UnauthorizedException} from "../exceptions/all.exceptions.js";
import jwt from "jsonwebtoken";
import Pool from "../db/index.js";
import {SelectQuery} from "../queries/index.js";

const {TokenExpiredError} = jwt;

export const checkRequestMiddleware = function (req, res, next) {
  try {
    const password = req.body.password;
    const email = req.body.email;
    if (!password || !email) {
      throw new UnauthorizedException('No password or email found');
    }
    req.token = {password: password, email: email}
    next()
  } catch (e) {
    return res.status(e.status).json({
      success: false,
      message: e.message
    })
  }
}

export const checkTokenMiddleware = function (req, res, next) {
  const bearer = req.headers['authorization'];
  if (typeof bearer !== 'undefined') {
    const bearerToken = bearer.split(' ')[1];
    req.token = bearerToken;
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'No token found'
    })
  }
}

export const authMiddleware = async function (req, res, next) {
  const {password, email} = req.body;
  try {
    if (!password) {
      throw new UnauthorizedException('No token found');
    }
    const data = await Pool.queries(SelectQuery('users', {email: email}));
    if (data?.email !== email) {
      return res.status(409).json({
        success: false,
        message: 'Wrong email'
      })
    }
    const passwordFromDb = await jwt.decode(data.refreshtoken, process.env.REFRESH_TOKEN_SECRET);
    if (passwordFromDb?.password !== password) {
      throw new UnauthorizedException('Wrong password');
    }
    const accessToken = data.accesstoken.toString();
    await jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err instanceof TokenExpiredError) {
        {
          req.token = {email: email, password: password}
          next()
        }
      }
      if (decoded) {
        return res.status(201).json({
          success: true,
          date: {
            id: data.id,
            accessToken: data.accesstoken,
            refreshToken: data.refreshtoken,
          }
        });
      }
    });
  } catch (e) {
    return res.status(404).json({
      success: false,
      message: e.message
    })
  }
}