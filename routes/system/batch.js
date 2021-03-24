// Essential Imports
const router = require("express").Router();

// Validation Middleware
const { _check_for_add_batch } = require("../../middlewares/validation");
const { _allowAdminManager } = require("../../middlewares/privilages");
const { check_for_access_token } = require("../middlewares/auth");

// Database Models
const BatchModel = require("../../models/education_models/batch");

/////////////////////////////////////////////////////
// METHOD :: POST
// DESCRIPTION :: Add batch to batches collection
// ACCESS :: Admin & Manager
// EXPECTED PAYLOAD TYPE :: body/json
/////////////////////////////////////////////////////
router.post(
  "/batch",
  check_for_access_token,
  _allowAdminManager,
  _check_for_add_batch,
  async (req, res) => {
    try {
      const batch = await BatchModel.findOne({
        name: req.body.name,
      });

      if (batch) throw Error("Same Batch Already Exists");

      const Batch = new BatchModel({
        name: req.body.name,
      });
      const ret = await Batch.save();
      res.status(200).json({ msg: "Batch added successfully", data: ret });
    } catch (err) {
      res.status(500).json({ msg: err?.message ?? err });
    }
  }
);

module.exports = router;
