const express = require("express");
const {
  getContacts,
  createContact,
  getContactID,
  updateContact,
  deleteContact,
} = require("../controllers/studentController");

const router = express.Router();

router.route("/").get(getContacts).post(createContact);
 

router.route("/:id").get(getContactID).put(updateContact).delete(deleteContact);
 

module.exports = router;