const router = require("express").Router();

// Routes
router.use("/notification", require("./create"));
router.use("/notification", require("./remove"));
router.use("/notification", require("./view"));
router.use("/notification", require("./modify"));

module.exports = router;
