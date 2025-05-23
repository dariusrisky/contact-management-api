const express = require("express");
const jwt = require("jsonwebtoken");

const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const { connectDB } = require("./config/db.config");

const app = express();

// Load environment variables from .env file
dotenv.config();
app.use(express.json());
app.use(cookieParser());

connectDB();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Routes
app.use("/api", require("./routes/webRoutes"));
