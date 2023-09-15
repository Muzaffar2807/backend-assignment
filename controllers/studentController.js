const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Student = require("../models/studentModel");

 
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

    res
      .status(200)
      .json({ message: "successfully loged In!", student: user });
  } else {
    res.status(401);
    throw new Error("ID or Password Invalid");
  }
});
 
const currentStudent = asyncHandler(async (req, res) => {
  res.json(req.user);
}); 

const getDeanSessions = asyncHandler(async (req, res) => {
  const deanSessions = generateDeanSessions();

  res.status(200).json({ deanSessions });
});

// Function to generate dean sessions
const generateDeanSessions = () => {
  const deanSessions = [];
  const daysOfWeek = ["Thursday", "Friday"];
  const startTime = "10:00 AM";
  const endTime = "11:00 AM";

  for (const day of daysOfWeek) {
    const session = {
      day,
      timeSlot: `${day}, ${startTime} - ${endTime}`,
    };

    deanSessions.push(session);
  }

  return deanSessions;
};

const bookDeanSession = asyncHandler(async (req, res) => {
  const { selectedSession, university_id } = req.body; // Assuming you have the student's ID in the request body

  // Find the student using the provided studentId
  const student = await Student.findById(university_id);

  if (!student) {
    res.status(404).json({ message: "Student not found" });
    return;
  }

  // Implement logic to book the selected dean session.
  // You can update the student's document to include the booked session information.

  // For example, you can add a field 'bookedSession' to the student schema and update it.
   

  res.status(200).json({ message: "Dean session booked successfully" });
});



module.exports = {
  registerStudent,
  loginStudent,
  currentStudent,
  getDeanSessions,
  bookDeanSession,
};
