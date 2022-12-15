import jwt from 'jsonwebtoken';
import Token from '../../models/token.model.js';

export const generateAccessToken = (id) => {
  const accessToken = jwt.sign(id, process.env.TOKEN_ACCESS_SECRET, { expiresIn: '30s' });
  const refreshToken = jwt.sign(id, process.env.TOKEN_REFRESH_SECRET, { expiresIn: '2m' });
  return { accessToken, refreshToken };
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

export const saveToken = async (userId, refreshToken) => {
  try {
    const tokenData = await Token.findOne({ user: userId });
    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      return tokenData.save();
    }
    return await Token.create({user: userId, refreshToken});
  } catch (err) {
    console.log(err);
  }
}