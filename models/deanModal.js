const mongoose = require("mongoose");

const deanSchema = mongoose.Schema(
  {
    dean_name: {
      type: String,
      require: [true, "Please add the Dean name"],
    },
    university_id: {
      type: String,
      require: [true, "Please add the Dean ID"],
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

module.exports = mongoose.model("Dean", deanSchema);
