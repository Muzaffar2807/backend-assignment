const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Student = require("../modals/studentModel");
const DeanSession = require("../modals/deanSessionModal");

const registerStudent = asyncHandler(async (req, res) => {
  const { university_id, student_name, password } = req.body;

  if (!university_id || !student_name || !password) {
    res.status(400);
    throw new Error(" All fields are mandatory");
  }

  const userAvailable = await Student.findOne({ university_id });

  if (userAvailable) {
    res.status(400);
    throw new Error("Student already register");
  }

  //Hash password
  const hashedPassword = await bcrypt.hash(password, 10);
  //console.log(hashedPassword)
  const user = await Student.create({
    student_name,
    university_id,
    password: hashedPassword,
  });

  console.log(user);

  if (user) {
    res.status(201).json({
      _id: user.id,
      student_name: user.student_name,
      university_id: user.university_id,
    });
  } else {
    res.status(400);
    throw new Error("User data is not Valid");
  }
});

const loginStudent = asyncHandler(async (req, res) => {
  const { university_id, password } = req.body;

  if (!university_id || !password) {
    res.status(400);
    throw new Error("All fields Mandatory");
  }

  const user = await Student.findOne({ university_id });

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

    res.status(200).json({ message: "successfully loged In!", student: user });
  } else {
    res.status(401);
    throw new Error("ID or Password Invalid");
  }
});

const currentStudent = asyncHandler(async (req, res) => {
  res.json(req.user);
});
 
const getAvailableDeanSessions = asyncHandler(async (req, res) => {
  try {
    // Fetch all available dean sessions
    const availableSessions = await DeanSession.find({ status: "available" });

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
