const express = require("express");
const { registerUser, loginUser, currentUser } = require("../controllers/studentController");
const {
  validateTokenMiddleware,
} = require("../middleware/validateTokenHandler");
 


const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/current",validateTokenMiddleware, currentUser)

module.exports = router;
