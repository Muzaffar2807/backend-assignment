const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    user_name: {
      type: String,
      require: [true, "Please add the user name"],
    },
    university_id: {
      type: Number,
      require: [true, "Please add the university ID"],
    },
    password: {
      type: String,
      required: [true, "Please enter password"],
    },
    role: {
      type: String,
      enum: ["student", "dean"],
      required: true,
    },
    token: { type: String },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
