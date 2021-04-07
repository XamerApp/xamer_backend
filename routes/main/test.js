// Essential Imports
const router = require("express").Router();

// Middlewares
const {
  _check_for_add_test,
  _check_for_remove_test,
  _check_for_update_test,
} = require("../../middlewares/validation");
const {
  _allowFaculty,
  _allowFacultyStudent,
} = require("../../middlewares/privilages");
const { check_for_access_token } = require("../../middlewares/auth");

// Database Models
const BatchModel = require("../../models/education_models/batch");
const DepartmentModel = require("../../models/education_models/department");
const SubjectModel = require("../../models/education_models/subject");
const TestModel = require("../../models/main_models/test");
const AnswerModel = require("../../models/main_models/answer");
const FacultyModel = require("../../models/user_models/faculty");
const StudentModel = require("../../models/user_models/student");
const { HandleError, NOTFOUND, BAD } = require("../../utils/error");
const { create_answer_sheet } = require("../../exam_ops/exam_ops");
const { is_eligible_to_create_test } = require("../../utils/date_ops");

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
      const faculty = await FacultyModel.findById(req.body.in_charge).select(
        "-password"
      );
      if (!faculty) throw Error("Faculty doesn't exists");

      // Checking if Faculty have permission to make a test in curtain departments
      const departments = faculty.departments;
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

      // Checking the timing is correct or not
      const start_time = new Date(req.body.start_time);
      if (!is_eligible_to_create_test(start_time, req.body.start_time_offset))
        throw new BAD("Time");

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

/////////////////////////////////////////////////////
// METHOD :: GET
// DESCRIPTION :: GET tests from database
// ACCESS :: Faculties & Students
// EXPECTED PAYLOAD TYPE :: none
/////////////////////////////////////////////////////
router.get(
  "/test",
  check_for_access_token,
  _allowFacultyStudent,
  async (req, res) => {
    try {
      const user = req.user.role;
      let searchConstrains;
      let populateConstrains;

      // Get UserInfo
      let User;
      if (user === "student") {
        User = await StudentModel.findOne({ username: req.user.username });
        searchConstrains = {
          department: User.department._id,
          batch: User.batch._id,
        };
        populateConstrains = [
          { path: "in_charge", select: ["-password"] },
          { path: "department" },
          { path: "batch" },
          { path: "subject" },
        ];
      } else {
        User = await FacultyModel.findOne({ username: req.user.username });
        searchConstrains = {
          in_charge: User.id,
        };
        populateConstrains = [
          { path: "in_charge", select: ["-password"] },
          { path: "department" },
          { path: "batch" },
          { path: "subject" },
          { path: "questions" },
        ];
      }
      if (!User) throw new NOTFOUND(req.user.name);

      const ret = await TestModel.find(searchConstrains).populate(
        populateConstrains
      );
      return res
        .status(200)
        .json({ msg: "Tests are successfully fetched.", data: ret });
    } catch (err) {
      return HandleError(err, res);
    }
  }
);

/////////////////////////////////////////////////////
// METHOD :: PUT
// DESCRIPTION :: Update Changes to the test
// ACCESS :: Faculty
// EXPECTED PAYLOAD TYPE :: body/json
/////////////////////////////////////////////////////
router.put(
  "/test",
  check_for_access_token,
  _check_for_update_test,
  _allowFaculty,
  async (req, res) => {
    try {
      const reqBlk = req.body;
      // Checking if test exists or not
      const test = await TestModel.findById(reqBlk.test_id);
      if (!test) throw new NOTFOUND("Test");

      // Checking if incharge is same or not
      if (reqBlk.in_charge != test.in_charge) throw new BAD("Faculty");

      // Getting in_charge data
      const in_charge = await FacultyModel.findById(test.in_charge).select(
        "-password"
      );

      // TODO
      // NEED TO IMPLEMENT TIME VALIDATION
      // NEED to check subjects are under in_charge

      const isDepartmentChanged =
        reqBlk.department != test.department ? true : false;
      // const isBatchChanged = reqBlk.batch != test.batch ? true : false;

      // Checking if department is going to be changed then
      // is that department under this in_charge or not??
      if (isDepartmentChanged) {
        const department = await DepartmentModel.findById(reqBlk.department);
        if (!department) throw new NOTFOUND("Requested Department");

        const ret = in_charge.departments.find((item) => {
          return item == department.id;
        });

        if (!ret) throw new NOTFOUND("Department in faculty");
      }

      // if (isDepartmentChanged || isBatchChanged) {
      //   // Delete whole answer setups if available
      //   await AnswerModel.deleteMany({ test_id: reqBlk.test_id });

      //   // Recreating answer schemas
      //   await create_answer_sheet(reqBlk.test_id);
      // }

      test.name = reqBlk.name;
      test.department = reqBlk.department;
      test.batch = reqBlk.batch;
      test.subject = reqBlk.subject;
      test.semester = reqBlk.semester;
      test.start_time = reqBlk.start_time;
      test.start_time_offset = reqBlk.start_time_offset;
      test.end_time_restrict = reqBlk.end_time_restrict;
      test.full_time = reqBlk.full_time;
      test.suffle = reqBlk.suffle;
      test.negative_marking = reqBlk.negative_marking;
      test.negative_value = reqBlk.negative_value;
      test.negative_threshold = reqBlk.negative_threshold;

      const ret = await test.save();
      return res
        .status(200)
        .json({ msg: "Test successfully updated.", data: ret });
    } catch (err) {
      return HandleError(err, res);
    }
  }
);

module.exports = router;
