const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Dean = require("../models/deanModal");

const registerDean = asyncHandler(async (req, res) => {
  try {
    const { university_id, dean_name, password } = req.body;

    if (!university_id || !dean_name || !password) {
      res.status(400).json({ message: "All fields are mandatory" });
      return;
    }

    const deanAvailable = await Dean.findOne({ university_id });

    if (deanAvailable) {
      res.status(400).json({ message: "Dean already registered" });
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const dean = await Dean.create({
      dean_name,
      university_id,
      password: hashedPassword,
    });

    if (dean) {
      res.status(201).json({
        _id: dean.id,
        dean_name: dean.dean_name,
        university_id: dean.university_id,
      });
    } else {
      res.status(400).json({ message: "Dean data is not valid" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});


const loginDean = asyncHandler(async (req, res) => {
  const { university_id, password } = req.body;

  if (!university_id || !password) {
    res.status(400);
    throw new Error("All fields Mandatory");
  }

  const user = await Dean.findOne({ university_id });

  //compare password

  if (user && (await bcrypt.compare(password, user.password))) {
    const accessToken = jwt.sign(
      {
        user: {
          university_id: user.university_id,
          email: user.email,
          id: user.id,
        },
      },
      process.env.ACCESS_TOKEN_SECERT,
      { expiresIn: "30m" }
    );
    // save user token
    user.token = accessToken;
    //Set the authorization header with the bearer token
    res.setHeader("Authorization", `Bearer ${accessToken}`);

    res.status(200).json({ message: "successfully loged In!", dean: user });
  } else {
    res.status(401);
    throw new Error("ID or Password Invalid");
  }
});

module.exports = {
  registerDean,
  loginDean,
};
