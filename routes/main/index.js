const router = require("express").Router();

// Routes
router.use("/", require("./test"));
router.use("/", require("./question"));
router.use("/", require("./exam"));

module.exports = router;
