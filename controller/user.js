const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();
    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    console.log('Error at register :',error)
    res.status(400).json({ error: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, 'process.env.JWT_SECRET', { expiresIn: "1h" });
    res.json({ token });
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Error logging in" });
  }
};

const getUserByEmail = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email }).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Error fetching user" });
  }
};

const deductGreenPoints = async (req, res) => {
  try {
    const { email, price } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.green_points < price)
      return res.status(400).json({ message: "Insufficient Green Points" });

    user.green_points -= price;
    await user.save();

    res.json({ message: "Purchase successful", green_points: user.green_points });
  } catch (error) {
    res.status(500).json({ message: "Error processing purchase" });
  }
};

const increaseGreenPoints = async (req, res) => {
    console.log("request recieved for increasing the green points", req.body)
    try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    user.green_points += 15;
    await user.save();

    res.json({ message: "Green Points increased successfully", green_points: user.green_points });
  } catch (error) {
      console.log(error)
    res.status(500).json({ message: "Error increasing Green Points", error: error.message });
  }
};

module.exports = { registerUser, loginUser, getUserByEmail, deductGreenPoints, increaseGreenPoints };
