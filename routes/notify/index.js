const router = require("express").Router();

// Routes
router.use("/notification", require("./create"));
router.use("/notification", require("./remove"));

module.exports = router;
