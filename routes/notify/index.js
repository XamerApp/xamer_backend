const router = require("express").Router();

// Routes
router.use("/notification", require("./create"));
router.use("/notification", require("./remove"));
router.use("/notification", require("./view"));

module.exports = router;
