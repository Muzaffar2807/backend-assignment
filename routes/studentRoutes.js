const express = require("express");
const {
  registerStudent,
  loginStudent,
  currentStudent,
  getDeanSessions,
  bookDeanSession,
} = require("../controllers/studentController");

const {
  validateTokenMiddleware,
} = require("../middleware/validateTokenHandler");
 


const router = express.Router();

router.post("/register", registerStudent);

router.post("/login", loginStudent);

router.get("/current", validateTokenMiddleware, currentStudent);
router.get("/dean-sessions", getDeanSessions);
router.post("/book-dean-session", bookDeanSession);


module.exports = router;
