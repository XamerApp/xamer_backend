const router = require("express").Router();
const crypto = require("bcrypt");

// Middlewares
const {
  _middleware_addManager,
  _middleware_addStudent,
  _middleware_addFaculty,
} = require("../utils/validationProps");
const { is_username_exists } = require("../middlewares/validation");
const {
  _allowAdmin,
  _allowAdminManager,
} = require("../middlewares/privilages");
const { check_for_access_token } = require("../middlewares/auth");

// Models
const AdminModel = require("../models/user_models/admin");
const ManagerModel = require("../models/user_models/manager");
const FacultyModel = require("../models/user_models/faculty");
const StudentModel = require("../models/user_models/student");
const DepartmentModel = require("../models/education_models/department");
const BatchModel = require("../models/education_models/batch");
const SubjectModel = require("../models/education_models/subject");

/////////////////////////////////////////////////////
// METHOD :: POST
// DESCRIPTION :: Register/Create Manager
// ACCESS :: Only Admins [TOKEN]
// EXPECTED PAYLOAD TYPE :: body/json
/////////////////////////////////////////////////////
router.post(
  "/manager",
  check_for_access_token,
  _allowAdmin,
  _middleware_addManager,
  is_username_exists,
  async (req, res) => {
    try {
      const username = req.body.username;
      const Manager = new ManagerModel({
        name: req.body.name.trim(),
        username: username.toLowerCase().trim(),
        password: await crypto.hash(req.body.password.trim(), 10),
      });
      ret = await Manager.save();

      // Excluding Password while sending back to the client
      const retObj = ret.toObject();
      delete retObj.password;

      res.status(200).json({ msg: "Success", data: retObj });
    } catch (err) {
      res.status(500).json({ msg: err?.message ?? err });
    }
  }
);

/////////////////////////////////////////////////////
// METHOD :: POST
// DESCRIPTION :: Register/Create Student
// ACCESS :: Admins, Managers [TOKEN]
// EXPECTED PAYLOAD TYPE :: body/json
/////////////////////////////////////////////////////
router.post(
  "/student",
  check_for_access_token,
  _allowAdminManager,
  _middleware_addStudent,
  is_username_exists,
  async (req, res) => {
    try {
      const department = await DepartmentModel.findById(
        req.body.department._id
      );
      if (!department) throw Error("Selected Department not available");

      const batch = await BatchModel.findById(req.body.batch._id);
      if (!batch) throw Error("Selected Batch not available");

      const Student = new StudentModel({
        name: req.body.name,
        email: req.body.email,
        username: req.body.username.toLowerCase().trim(),
        password: await crypto.hash(req.body.password.trim(), 10),
        roll: req.body.roll,
        semester: req.body.semester,
        department: department,
        batch: batch,
      });

      const ret = await Student.save();

      // Excluding Password while sending back to the client
      const retObj = ret.toObject();
      delete retObj.password;

      if (!ret) throw Error("Error while saving student data into database");

      res.status(200).json({ msg: "Success", data: retObj });
    } catch (err) {
      res.status(500).json({ msg: err?.message ?? err });
    }
  }
);

/////////////////////////////////////////////////////
// METHOD :: POST
// DESCRIPTION :: Register/Create Faculty
// ACCESS :: Admins, Managers [TOKEN]
// EXPECTED PAYLOAD TYPE :: body/json
/////////////////////////////////////////////////////
router.post(
  "/faculty",
  check_for_access_token,
  _allowAdminManager,
  _middleware_addFaculty,
  is_username_exists,
  async (req, res) => {
    try {
      const departments = [];
      const subjects = [];
      if (
        req.body.hasOwnProperty("departments") &&
        Array.isArray(req.body.departments)
      ) {
        const depts = req.body.departments;
        let err = false;
        for (let i = 0; i < depts.length; i++) {
          const dept = await DepartmentModel.findById(depts[i]);
          if (!dept) {
            err = true;
            break;
          } else {
            departments.push(dept);
          }
        }
        if (err) throw Error("Invalid Departments found");
      }

      if (
        req.body.hasOwnProperty("subjects") &&
        Array.isArray(req.body.subjects)
      ) {
        const subs = req.body.subjects;
        let err = false;
        for (let i = 0; i < subs.length; i++) {
          const sub = await SubjectModel.findById(subs[i]);
          if (!sub) {
            err = true;
            break;
          } else {
            subjects.push(sub);
          }
        }
        if (err) throw Error("Invalid Subjects found");
      }

      const username = req.body.username;

      const Faculty = new FacultyModel({
        name: req.body.name,
        username: username.toLowerCase(),
        password: await crypto.hash(req.body.password.trim(), 10),
        departments: departments,
        subjects: subjects,
      });

      const ret = await Faculty.save();

      // Excluding Password while sending back to the client
      const retObj = ret.toObject();
      delete retObj.password;

      if (!ret) throw Error("Error while saving faculty data into database");

      res.status(200).json({ msg: "Success", data: retObj });
    } catch (err) {
      res.status(500).json({ msg: err?.message ?? err });
    }
  }
);

module.exports = router;
