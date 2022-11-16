import User from '../../models/user.model.js';
import { generateAccessToken } from '../middleware/generate_token.middleware.js';
import { encryptPassword } from "../../helper/encryptPassword";

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

    const encryptPassword = encryptPassword(password);

    if (encryptPassword !== user.password) {
      return res.status(401).send('Error! Data not correct');
    }

    const token = generateAccessToken({ id: user._id });
    res.status(200).send({ access_token: token });
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};
