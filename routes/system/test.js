// Essential Imports
const router = require("express").Router();

// Middlewares
const {
  _check_for_add_test,
  _check_for_remove_test,
} = require("../../middlewares/validation");
const { _allowFaculty } = require("../../middlewares/privilages");
const { check_for_access_token } = require("../middlewares/auth");

// Database Models
const BatchModel = require("../../models/education_models/batch");
const DepartmentModel = require("../../models/education_models/department");
const SubjectModel = require("../../models/education_models/subject");
const TestModel = require("../../models/main_models/test");
const FacultyModel = require("../../models/user_models/faculty");

/////////////////////////////////////////////////////
// METHOD :: POST
// DESCRIPTION :: Add test to test collection
// ACCESS :: Faculty
// EXPECTED PAYLOAD TYPE :: body/json
/////////////////////////////////////////////////////
router.post(
  "/test",
  check_for_access_token,
  _allowFaculty,
  _check_for_add_test,
  async (req, res) => {
    try {
      // Checking if Department is available or not
      const department = await DepartmentModel.findById(req.body.department);
      if (!department) throw Error("Department Not Found");

      // Checking if Batch is available or not
      const batch = await BatchModel.findById(req.body.batch);
      if (!batch) throw Error("Batch Not found");

      // Checking if subject is available or not
      const subject = await SubjectModel.findById(req.body.subject);
      if (!subject) throw Error("Subject Not found");

      // Checking if semester is valid or not
      if (req.body.semester > department.semesters || req.body.semester < 1) {
        throw Error("Invalid Semester");
      }

      // Checking if faculty is exists or not
      const faculty = await FacultyModel.findById(req.body.in_charge);
      if (!faculty) throw Error("Faculty doesn't exists");

      // Checking if Faculty have permission to make a test in curtain departments
      const departments = Array(faculty.departments);
      const dept_perm = departments.find((item) => {
        return item == department.id;
      });
      if (!dept_perm) {
        throw Error(
          "Faculty doesn't have permission to create test into this department"
        );
      }

      // Checking if same test available or not
      const prevTest = await TestModel.findOne({
        name: req.body.name,
        in_charge: faculty,
        department: department,
        batch: batch,
        subject: subject,
        semester: req.body.semester,
      });
      if (prevTest) throw Error("Same Test Already Exists");

      // Checking errors in Groups prop
      let groups = [];
      let err = false;

      if (Array.isArray(req.body.groups)) {
        const testArr = req.body.groups;
        for (let i = 0; i < testArr.length; i++) {
          const testArrItem = testArr[i];
          if (
            typeof testArrItem["name"] == "string" &&
            Array.isArray(testArrItem["sections"])
          ) {
            const testSections = testArrItem["sections"];
            for (let j = 0; j < testSections.length; j++) {
              if (typeof testSections[j] != "string") {
                err = true;
                break;
              }
            }
          } else {
            err = true;
            break;
          }
        }
      } else {
        err = true;
      }

      if (err) {
        groups = [{ name: "Group 1", sections: ["Set 1"] }];
      } else {
        groups = req.body.groups;
      }

      // Creating a instance of Test
      const Test = new TestModel({
        name: req.body.name,
        in_charge: faculty,
        department: department,
        batch: batch,
        subject: subject,
        semester: req.body.semester,
        start_time: req.body.start_time,
        start_time_offset: req.body.start_time_offset,
        end_time_restrict: req.body.end_time_restrict,
        full_time: req.body.full_time,
        suffle: req.body.suffle,
        negative_marking: req.body.negative_marking,
        negative_value: req.body.negative_value,
        negative_threshold: req.body.negative_threshold,
        groups: groups,
        questions: [],
        answers: [],
      });

      // Saving Test into the database
      const ret = await Test.save();

      res.status(200).json({ msg: "Test added successfully", data: ret });
    } catch (err) {
      res.status(500).json({ msg: err?.message ?? err });
    }
  }
);

/////////////////////////////////////////////////////
// METHOD :: DELETE
// DESCRIPTION :: Remove test from database
// ACCESS :: Faculty
// EXPECTED PAYLOAD TYPE :: query/String
/////////////////////////////////////////////////////
router.delete(
  "/test",
  check_for_access_token,
  _allowFaculty,
  _check_for_remove_test,
  async (req, res) => {
    try {
      // Checking if faculty is exists or not
      const faculty = await FacultyModel.findById(req.query.in_charge);
      if (!faculty) throw Error("Faculty doesn't exists");

      const test = await TestModel.findById(req.query.id);
      if (!test) throw Error("Test Doesn't Exists");

      if (faculty.id != test.in_charge) {
        throw Error("Faculty doesn't have permission to remove this test");
      }

      // Saving Test into the database
      const ret = await TestModel.findByIdAndDelete(req.query.id);

      res.status(200).json({ msg: "Test removed successfully", data: ret });
    } catch (err) {
      res.status(500).json({ msg: err?.message ?? err });
    }
  }
);

module.exports = router;
