// Essential Imports
const router = require("express").Router();

// Validation Middleware
const { _check_for_add_subject } = require("../../middlewares/validation");
const { _allowAdminManager } = require("../../middlewares/privilages");
const { check_for_access_token } = require("../../middlewares/auth");

// Database Models
const SubjectModel = require("../../models/education_models/subject");

/////////////////////////////////////////////////////
// METHOD :: POST
// DESCRIPTION :: Add subjects to subject collection
// ACCESS :: Admin & Manager
// EXPECTED PAYLOAD TYPE :: body/json
/////////////////////////////////////////////////////
router.post(
  "/subject",
  check_for_access_token,
  _allowAdminManager,
  _check_for_add_subject,
  async (req, res) => {
    try {
      const subject = await SubjectModel.findOne({
        paper_code: req.body.paper_code,
      });

      if (subject) throw Error("Same Paper Code Already Exists");

      const Subject = new SubjectModel({
        name: req.body.name,
        paper_code: req.body.paper_code,
      });
      const ret = await Subject.save();
      res.status(200).json({ msg: "Subject added successfully", data: ret });
    } catch (err) {
      res.status(500).json({ msg: err?.message ?? err });
    }
  }
);

module.exports = router;
