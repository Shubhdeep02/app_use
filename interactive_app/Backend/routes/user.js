const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const { hashSync } = require("bcryptjs");

const router = express.Router();

router.post("/signup", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  console.log("Received Email:", email);
  console.log("Received Password:", password);

  try {
    const user = await User.findOne({ email }).select("+password");
    console.log(user);
    if (!user) {
      return res.status(400).json({ message: "Email not registered" });
    }

    const isMatch = await bcrypt.compareSync(password, user.password);
    console.log("Password Match:", isMatch);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password" });
    }
    res.status(201).json({ message: "User logged in successfully" });
  } catch (error) {
    console.error("Sign-In Error:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
