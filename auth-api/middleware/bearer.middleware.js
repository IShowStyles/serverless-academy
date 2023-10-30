export const bearerMiddleware = function (req, res, next) {
  if (!req.headers.authorization && req.headers.authorization.split(' ')[0] !== 'Bearer') {
    return res.status(401).json({
      error: 'No credentials sent!',
      msg: 'invalid token'
    });
  }
  const token = req.headers.authorization.split(' ')[1];
  if (token == 'null') {
    return res.status(401).json({
      error: 'No credentials sent!',
      msg: 'invalid token'
    });
  }
  req.token = token;
  next()
}