import jwt from 'jsonwebtoken';

export const generateAccessToken = (id) => {
  return jwt.sign(id, process.env.TOKEN_ACCESS_SECRET, { expiresIn: '1h' });
};

export const authenticateToken = (req, res, next) => {
  const { authorization } = req.headers;
  const token = authorization.replace('Bearer ', '');

  if (!token) {
    return res.status(401).send('Error! Unauthorized');
  }

  jwt.verify(token, process.env.TOKEN_ACCESS_SECRET, (err, result) => {
    if (err) {
      console.log('err', err);
      return res.status(401).send('Error! Token expired');
    }

    req.user = result;
    return next();
  })
};