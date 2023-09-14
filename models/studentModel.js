const mongoose = require("mongoose");

const studentSchema = mongoose.Schema(
  {
    name: {
      type: String,
      require: [true, "Please add the Student name"],
    },
    email: {
      type: String,
      require: [true, "Please add the Student email"],
    },
    phone: {
      type: String,
      require: [true, "Please add the Student number"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Student", studentSchema);
