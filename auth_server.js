// Fetching Environment Variables
require("dotenv").config();

// Essential imports
const express = require("express");
const mongoose = require("mongoose");

// Middlewares
const { check_for_access_token } = require("./middlewares/auth");

// Routes
const auth_routes = require("./routes/auth/index");

// Initializing Express
const app = express();

// Using Express Request Parser middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Using routes
app.use("/", auth_routes);

// Connecting to the database
mongoose
  .connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database connected :)");
  })
  .catch((err) => {
    console.log(err?.message ?? err);
  });

// Testing API
app.get("/", check_for_access_token, (req, res) => {
  return res.status(200).json({ msg: "Testing API" });
});

app.listen(process.env.AUTH_PORT || process.env.PORT, () => {
  console.log(
    `AUTH SERVER Running at :: ${process.env.AUTH_PORT || process.env.PORT}`
  );
});
