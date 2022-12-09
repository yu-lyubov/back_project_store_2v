import User from '../../models/user.model.js';
import { generateAccessToken } from '../middleware/token.middleware.js';
import { encryptPassword } from "../../helper/encryptPassword.js";

export const registrationUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const hash = encryptPassword(password);

    const user = new User({
      email,
      password: hash,
    });

    await user.save();

    const token = generateAccessToken({ id: user._id });
    res.status(200).send({ access_token: token });
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

    const token = generateAccessToken({ id: user._id });
    res.status(200).send({ access_token: token });
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
