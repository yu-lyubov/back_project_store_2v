import jwt from 'jsonwebtoken';
import User from '../../models/user.model.js';
import Token from '../../models/token.model.js';
import { generateAccessToken, saveToken } from '../middleware/token.middleware.js';
import { encryptPassword } from '../../helper/encryptPassword.js';

export const registrationUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const hash = encryptPassword(password);

    const user = new User({
      email,
      password: hash,
    });

    await user.save();

    const tokens = generateAccessToken({ id: user._id });
    await saveToken(user._id, tokens.refreshToken);

    delete user._doc.password;

    res.cookie('refreshToken', tokens.refreshToken, { maxAge: 60 * 60 * 1000, httpOnly: true });
    return res.status(200).send({ accessToken: tokens.accessToken, user });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(409).send('Error! Email already exists!');
    }
    res.status(500).send(err);
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).send('Error! User not found');
    }

    const encryptPasswordFromRequest = encryptPassword(password);

    if (encryptPasswordFromRequest !== user.password) {
      return res.status(401).send('Error! Data not correct');
    }

    const tokens = generateAccessToken({ id: user._id });
    await saveToken(user._id, tokens.refreshToken);

    delete user._doc.password;

    res.cookie('refreshToken', tokens.refreshToken, { maxAge: 60 * 60 * 1000, httpOnly: true });
    return res.status(200).send({ accessToken: tokens.accessToken, user });
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

export const logoutUser = () => {};

export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(401).send('Error! Unauthorized');
    }

    const userData = jwt.verify(refreshToken, process.env.TOKEN_REFRESH_SECRET);
    const tokenFromDB = Token.findOne({ refreshToken });

    if (!userData || !tokenFromDB) {
      return res.status(403).send('Error! Token not correct!');
    }

    const user = await User.findById( userData.id );
    const tokens = generateAccessToken({ id: user._id });
    await saveToken(user._id, tokens.refreshToken);

    res.cookie('refreshToken', tokens.refreshToken, { maxAge: 60 * 60 * 1000, httpOnly: true });
    return res.status(200).send({ accessToken: tokens.accessToken });
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

export const getUserData = async (req, res) => {
  try {
    const { id } = req.user;

    const user = await User.findById(id).select({ "name": 1, "age": 1, "male": 1, "_id": 0 });

    res.status(200).send(user);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

export const changeUserData = async (req, res) => {
  try {
    const { id } = req.user;
    const { name, age, male } = req.body;
    console.log('name, age, male', name, age, male);

    const changedUserData = {
      name,
      age,
      male,
    };

    const changedUser = await User
      .findOneAndUpdate({ _id: id }, changedUserData, { new: true })
      .select({ "name": 1, "age": 1, "male": 1, "_id": 0 });

    res.status(200).send(changedUser);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

export const changePassword = async (req, res) => {
  try {
    const { id } = req.user;
    const { password, newPassword } = req.body;

    const user = await User.findById(id);
    console.log('user', user);

  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};
