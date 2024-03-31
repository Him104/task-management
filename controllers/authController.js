const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    // Create new user
    const newUser = new User({ email, password });
    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Validate email and password
    if (!password) {
      return res.status(400).send({ status: false, msg: "Password is required" });
    }
    if (!email) {
      return res.status(400).send({ status: false, msg: "Email is required" });
    }
    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).send({ status: false, msg: "Email is not valid" });
    }
    // Find user in the database
    const checkUser = await User.findOne({ email, password });
    if (!checkUser) {
      return res.status(404).send({ status: false, msg: "Email or password is not correct" });
    } else {
      // Generate JWT token
      const token = jwt.sign({ _id: checkUser._id.toString() }, "him104");
      return res.status(201).send({ status: true, token });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ msg: error.message });
  }
};
