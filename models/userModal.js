const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      require: [true, "Please add the User name"],
    },
    email: {
      type: String,
      require: [true, "Please add the Student email"],
      unique: [true, "Email already taken"],
    },
    password: {
      type: String,
      require: [true, "Please enter password"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
