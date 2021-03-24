const router = require("express").Router();

// Routes
router.use("/", require("./test"));
router.use("/", require("./question"));

module.exports = router;
