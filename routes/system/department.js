// Essential Imports
const router = require("express").Router();

// Validation Middleware
const { _check_for_add_department } = require("../../middlewares/validation");
const { _allowAdminManager } = require("../../middlewares/privilages");
const { check_for_access_token } = require("../../middlewares/auth");

// Database Models
const DepartmentModel = require("../../models/education_models/department");

///////////////////////////////////////////////////////////
// METHOD :: POST
// DESCRIPTION :: Add department to departments collection
// ACCESS :: Admin & Manager
// EXPECTED PAYLOAD TYPE :: body/json
///////////////////////////////////////////////////////////
router.post(
  "/department",
  check_for_access_token,
  _allowAdminManager,
  _check_for_add_department,
  async (req, res) => {
    try {
      const department = await DepartmentModel.findOne({
        name: req.body.name,
        short_name: req.body.short_name,
      });

      if (department) throw Error("Same Department Already Exists");

      const Department = new DepartmentModel({
        name: req.body.name,
        short_name: req.body.short_name,
        semesters: req.body.semesters,
      });
      const ret = await Department.save();
      res.status(200).json({ msg: "Department added successfully", data: ret });
    } catch (err) {
      res.status(500).json({ msg: err?.message ?? err });
    }
  }
);

module.exports = router;
