const mongoose = require("mongoose");
 

const DeanSessionSchema = mongoose.Schema({
  slot: {
    type: Number,
    required: true,
    enum: [1, 2],
  },
  day: {
    type: String,
    required: true,
    enum: ["THURSDAY", "FRIDAY"],
  },
  status: {
    type: String,
    required: true,
    enum: ["available", "booked"],
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
 
DeanSessionSchema.pre("save", function (next) {
  this.end_time = new Date(this.start_time.getTime() + 60 * 60 * 100);  
  next();
});

DeanSessionSchema.pre("findOneAndUpdate", async function () {
  const session = this;  

  if (session.getUpdate().$set.end_time < new Date()) { 
    session.updateOne({ status: "available" });  
  }
});

module.exports = mongoose.model("DeanSession", DeanSessionSchema);
