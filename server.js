const express = require("express");
const errorHandler = require("./middleware/errorHandler");
const connectDb = require("./config/dbConnection");
const dotenv = require("dotenv").config();

connectDb();
const app = express();

const port = process.env.PORT || 3001;

app.use(express.json());
app.use("/api/contacts", require("./routes/contactRoutes"));
app.use("/api/students", require("./routes/studentRoutes.js"));
app.use(errorHandler)

app.listen(port, () => console.log(`Server running on ${port}`));