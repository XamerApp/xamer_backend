const router = require("express").Router();

// Routes
router.use("/god", require("./init"));
router.use("/god", require("./create"));

module.exports = router;
