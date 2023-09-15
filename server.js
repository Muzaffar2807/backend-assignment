const express = require("express");
const errorHandler = require("./middleware/errorHandler");
const connectDb = require("./config/dbConnection");
const dotenv = require("dotenv").config();

connectDb();
const app = express();

const port = process.env.PORT || 3001;

app.use(express.json());
app.use("/api/dean", require("./routes/deanRoutes"));
app.use("/api/students", require("./routes/studentRoutes"));
app.use(errorHandler)

app.listen(port, () => console.log(`Server running on ${port}`));
