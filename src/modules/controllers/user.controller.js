import User from "../../models/user.model.js";

export const registrationUser = async (req, res) => {
  try {
    const { email, password, name, age, male } = req.body;

    const user = new User({
      email,
      password,
      name,
      age,
      male
    });

    await user.save();

    res.status(200).send(user);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};