// Essential imports
const router = require("express").Router();

// Routes
const login_route = require("./login");
const logout_route = require("./logout");

// Gattering Routes
router.use("/login", login_route);
router.use("/logout", logout_route);

module.exports = router;
