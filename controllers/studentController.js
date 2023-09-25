const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Student = require("../models/studentModel");
const DeanSession = require("../models/deanSessionModel");
const User = require("../models/usersModel");
const dotenv = require("dotenv").config();


const registerStudent = asyncHandler(async (req, res) => {
  try {
    const { university_id, user_name, password, role } = req.body;

    if (!university_id || !user_name || !password || !role) {
      res.status(400).json({ message: "All fields are mandatory" });
      return;
    }

    const userAvailable = await User.findOne({ university_id });

    if (userAvailable) {
      res.status(400).json({ message: `${role} already registered` });
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      user_name,
      university_id,
      password: hashedPassword,
      role,
    });

    if (user) {
      res.status(201).json({
        _id: user.id,
        user_name: user.user_name,
        university_id: user.university_id,
        role: user.role,
      });
    } else {
      res.status(400).json({ message: `${role} data is not valid` });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

const loginStudent = asyncHandler(async (req, res) => {
  try {
    const { university_id, password } = req.body;

    if (!university_id || !password) {
      res.status(400).json({ message: "All fields mandatory" });
      throw new Error("All fields mandatory");
    }

    const user = await User.findOne({ university_id });

    if (!user) {
      res.status(401);
      throw new Error("ID or Password Invalid");
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      res.status(401).json({ message: "ID or Password Invalid" });
      throw new Error("ID or Password Invalid");
    }

    const accessToken = jwt.sign(
      {
        user: {
          university_id: user.university_id,
          //email: user.email,
          id: user.id,
        },
      },
      process.env.ACCESS_TOKEN_SECERT,
      { expiresIn: "30m" }
    );

    // Save user token
    user.token = accessToken;

    // Set the authorization header with the bearer token
    res.setHeader("Authorization", `Bearer ${accessToken}`);

    res.status(200).json({ message: "successfully logged In!", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

const currentStudent = asyncHandler(async (req, res) => {
  res.json(req.user);
});

const getAvailableDeanSessions = asyncHandler(async (req, res) => {
  try {
    const availableSessions = await DeanSession.find({ status: "available" });

    if (availableSessions.length === 0) {
      return res.status(200).json({ message: "No available sessions found" });
    }
    res.status(200).json(availableSessions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

const bookDeanSession = asyncHandler(async (req, res) => {
  const { session_id, university_id } = req.body;

  try {
    const session = await DeanSession.findById(session_id);

    if (!session) {
      res.status(404).json({ message: "Session not found" });
      return;
    }
    if (session.status !== "available") {
      res.status(400).json({ message: "Session is not available for booking" });
      return;
    }
    session.status = "booked";
    session.booked_by = university_id;

    await session.save();

    res.status(200).json({ message: "Dean session booked successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = {
  registerStudent,
  loginStudent,
  currentStudent,
  getAvailableDeanSessions,
  bookDeanSession,
};
