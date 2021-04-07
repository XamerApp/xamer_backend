// Fetching Environment Variables
require("dotenv").config();

// Essential imports
const express = require("express");
const mongoose = require("mongoose");

// Routes
const main_routes = require("./routes/main");
const system_routes = require("./routes/system");
const register_routes = require("./routes/register");

// Initializing Express
const app = express();

// Using Express Request Parser middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Using routes
app.use("/register", register_routes);
app.use("/", system_routes);
app.use("/", main_routes);

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

app.listen(process.env.PORT, () => {
  console.log(`API SERVER Running at :: ${process.env.PORT}`);
});
