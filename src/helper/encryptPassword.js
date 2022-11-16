import CryptoJS from 'crypto-js';

export const encryptPassword = (password) => {
  return CryptoJS.HmacSHA256(password, process.env.SALT).toString();
};
