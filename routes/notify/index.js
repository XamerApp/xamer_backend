const router = require("express").Router();

// Routes
router.use("/notification", require("./create"));

module.exports = router;
