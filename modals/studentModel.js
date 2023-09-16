const mongoose = require("mongoose");

const studentSchema = mongoose.Schema(
  {
    student_name: {
      type: String,
      require: [true, "Please add the Student name"],
    },
    university_id: {
      type: String,
      require: [true, "Please add the Student name"],
    },
    password: {
      type: String,
      required: [true, "Please enter password"],
    },
    token: { type: String },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Student", studentSchema);
