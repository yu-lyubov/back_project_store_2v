import jwt from 'jsonwebtoken';

export const generateAccessToken = (id) => {
  return jwt.sign(id, process.env.JWT_ACCESS_SECRET, { expiresIn: '10m' });
};