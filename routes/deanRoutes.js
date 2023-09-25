const express = require("express");
const {
  registerDean,
  loginDean,
  registerUser,
  loginUser,
  getPendingDeanSessions,
} = require("../controllers/deanController");

const router = express.Router();
 

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/pending-sessions", getPendingDeanSessions)
 
 
 

module.exports = router;
