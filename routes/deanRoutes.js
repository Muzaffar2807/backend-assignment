const express = require("express");
const {
  registerDean,
  loginDean,
  getPendingDeanSessions,
} = require("../controllers/deanController");

const router = express.Router();
 

router.post("/register", registerDean);

router.post("/login", loginDean);

router.get("/pending-sessions", getPendingDeanSessions)
 
 
 

module.exports = router;
