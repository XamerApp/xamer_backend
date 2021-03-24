const router = require("express").Router();

// Routes
router.use("/", require("./department"));
router.use("/", require("./subject"));
router.use("/", require("./batch"));

module.exports = router;
