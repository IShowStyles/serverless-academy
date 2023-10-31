import {ConflictException, UnauthorizedException} from "../exceptions/all.exceptions.js";
import jwt from "jsonwebtoken";
import Pool from "../db/index.js";
import {SelectQuery} from "../queries/index.js";

const {TokenExpiredError} = jwt;

export const checkRequestMiddleware = function (req, res, next) {
  const password = req.body.password;
  const email = req.body.email;
  if (!password || !email) {
    return new UnauthorizedException('No password or email found');
  }
  req.token = {password: password, email: email}
  next()
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
      return new UnauthorizedException('No token found');
    }
    const data = await Pool.queries(SelectQuery('users', {email: email}));
    if (data?.email !== email) {
      return new ConflictException('User with this email doesnt exists');
    }
    const passwordFromDb = await jwt.decode(data.refreshtoken, process.env.REFRESH_TOKEN_SECRET);
    if (passwordFromDb?.password !== password) {
      return res.status(409).json({
        success: false,
        message: 'Wrong password'
      })
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
        return res.status(200).json({
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