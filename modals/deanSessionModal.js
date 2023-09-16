const mongoose = require("mongoose");

const DeanSessionSchema = mongoose.Schema({
  slot: {
    type: Number,
    //required: true,
    enum: [1, 2], // Only allow values 1 or 2
  },
  day: {
    type: String,
   // required: true,
    enum: ["THURSDAY", "FRIDAY"], // Only allow THURSDAY or FRIDAY
  },
  status: {
    type: String,
    //required: true,
    enum: ["available", "booked"], // Example values, adjust as needed
  },
  booked_by: {
    type: String,
    required: false,
  },
  start_time: {
    type: Date,
    default: Date.now,
    required: false,
  },
  end_time: {
    type: Date,
    required: false,
  },
});

// Middleware to set the end_date to 1 hour after bookingDate
DeanSessionSchema.pre("save", function (next) {
  this.end_time = new Date(this.start_time.getTime() + 60 * 60 * 1000); // Adding 1 hour in milliseconds
  next();
});

module.exports = mongoose.model("DeanSession", DeanSessionSchema);
