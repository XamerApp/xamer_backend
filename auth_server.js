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

// Connecting to the database
mongoose
  .connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("Database connected :)");
  })
  .catch((err) => {
    console.log(err?.message ?? err);
  });

// Requiring models
require("./models/education_models/department");
require("./models/education_models/batch");
require("./models/education_models/subject");
require("./models/main_models/answer");
require("./models/main_models/question");
require("./models/main_models/test");
require("./models/user_models/admin");
require("./models/user_models/faculty");
require("./models/user_models/manager");
require("./models/user_models/student");

// Using routes
app.use("/", auth_routes);

// Testing API
app.get("/", check_for_access_token, (req, res) => {
  return res.status(200).json({ msg: "Testing API" });
});

app.listen(process.env.AUTH_PORT || process.env.PORT, () => {
  console.log(
    `AUTH SERVER Running at :: ${process.env.AUTH_PORT || process.env.PORT}`
  );
});
