const router = require("express").Router();

// Routes
router.use("/", require("./test"));
router.use("/", require("./question"));
router.use("/", require("./exam"));
router.use("/", require("./result"));
router.use("/", require("./review"));

module.exports = router;
