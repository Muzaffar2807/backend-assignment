const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Dean = require("../modals/deanModal");
const Student = require("../modals/studentModel");
const DeanSession = require("../modals/deanSessionModal");

const User = require("../modals/usersModal");

/* const registerDean = asyncHandler(async (req, res) => {
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
}); */

const registerUser = asyncHandler(async (req, res) => {
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
    res.status(500).json({ message: "Internal Server Error" });
  }
});

const loginUser = asyncHandler(async (req, res) => {
  try {
    const { university_id, password } = req.body;

    if (!university_id || !password) {
      res.status(400);
      throw new Error("All fields Mandatory");
    }

    console.log(university_id);
    const user = await User.findOne({ university_id });

    if (!user) {
      res.status(401);
      throw new Error("ID or Password Invalid");
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      res.status(401);
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

/* const loginDean = asyncHandler(async (req, res) => {
  try {
    const { university_id, password } = req.body;

    if (!university_id || !password) {
      res.status(400);
      throw new Error("All fields Mandatory");
    }

    const user = await Dean.findOne({ university_id });

    if (!user) {
      res.status(401);
      throw new Error("ID or Password Invalid");
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      res.status(401);
      throw new Error("ID or Password Invalid");
    }

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

    // Save user token
    user.token = accessToken;

    // Set the authorization header with the bearer token
    res.setHeader("Authorization", `Bearer ${accessToken}`);

    res.status(200).json({ message: "successfully logged In!", dean: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}); */

const getPendingDeanSessions = asyncHandler(async (req, res) => {
  const { university_id } = req.body;

  try {
    const pendingSessions = await DeanSession.find({
      status: "booked",
    });

    const currentTime = new Date();

    const sessionDetails = await Promise.all(
      pendingSessions.map(async (session) => {
        const student = await Student.findOne({
          university_id: session.booked_by,
        });

        if (!student) {
          return {
            student_name: "Student Not Found",
            session_slot: session.slot,
            session_day: session.day,
          };
        }
        if (session.end_time && new Date(session.end_time) > currentTime) {
          return {
            student_name: student.student_name,
            session_slot: session.slot,
            session_day: session.day,
          };
        }
        return null;
      })
    );
    const validSessionDetails = sessionDetails.filter(
      (session) => session !== null
    );

    if (validSessionDetails.length === 0) {
      return res.status(200).json({ message: "No pending sessions found" });
    }

    res.status(200).json({ "booked-sessions": validSessionDetails });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = {
  //registerDean,
  // loginDean,
  getPendingDeanSessions,
  registerUser,
  loginUser,
};
