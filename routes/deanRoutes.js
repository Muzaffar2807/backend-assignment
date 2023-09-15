const express = require("express");
const { 
  registerDean,
  loginDean
} = require("../controllers/deanController");

const router = express.Router();
 

router.post("/register", registerDean);

router.post("/login", loginDean);
 
 
 

module.exports = router;
