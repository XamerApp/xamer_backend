// Essential Imports
const router = require("express").Router();

// Validation Middleware
const {
  _check_for_add_subject,
  _check_for_update_subject,
} = require("../../middlewares/validation");
const { _allowAdminManager } = require("../../middlewares/privilages");
const { check_for_access_token } = require("../../middlewares/auth");

// Database Models
const SubjectModel = require("../../models/education_models/subject");
const { HandleError, NOTFOUND, EXISTS } = require("../../utils/error");

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

/////////////////////////////////////////////////////
// METHOD :: PUT
// DESCRIPTION :: Update Subject info
// ACCESS :: Admin & Manager
// EXPECTED PAYLOAD TYPE :: body/json
/////////////////////////////////////////////////////
router.put(
  "/subject",
  check_for_access_token,
  _allowAdminManager,
  _check_for_update_subject,
  async (req, res) => {
    try {
      const subject = await SubjectModel.findById(req.body.subject_id);
      if (!subject) throw new NOTFOUND("Subject");

      // Checking for same subject name
      if (subject.name != req.body.name) {
        const found = await SubjectModel.exists({ name: req.body.name });
        if (found) throw new EXISTS("Subject Name");
      }

      // Checking for same subject paper code
      if (subject.paper_code != req.body.paper_code) {
        const found = await SubjectModel.exists({
          paper_code: req.body.paper_code,
        });
        if (found) throw new EXISTS("Subject Paper Code");
      }

      subject.name = req.body.name;
      subject.paper_code = req.body.paper_code;
      const ret = await subject.save();
      res.status(200).json({ msg: "Subject successfully updated", data: ret });
    } catch (err) {
      return HandleError(err, res);
    }
  }
);

module.exports = router;
