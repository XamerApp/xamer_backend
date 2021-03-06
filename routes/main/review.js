// Essential imports
const router = require("express").Router();
const { HandleError, NOTFOUND, BAD, INVALID } = require("../../utils/error");

const { check_for_access_token } = require("../../middlewares/auth");
const { _allowAdminManagerFaculty } = require("../../middlewares/privilages");
const {
  _check_for_get_test_review_data,
  _check_for_save_review_data,
} = require("../../middlewares/validation");

// Models
const AnswerModel = require("../../models/main_models/answer");
const TestModel = require("../../models/main_models/test");
const StudentModel = require("../../models/user_models/student");
const { is_eligible_to_get_result } = require("../../utils/date_ops");

/////////////////////////////////////////////////////
// METHOD :: GET
// DESCRIPTION :: Get test data for review
// ACCESS :: Admin, Manager, Faculty
// EXPECTED PAYLOAD TYPE :: query/string
/////////////////////////////////////////////////////
router.get(
  "/test/review",
  check_for_access_token,
  _check_for_get_test_review_data,
  _allowAdminManagerFaculty,
  async (req, res) => {
    try {
      const { test_id } = req.query;
      const test = await TestModel.findById(test_id);
      if (!test) throw new NOTFOUND("Requested Test");

      if (req.user.role === "faculty" && req.user.id != test.in_charge) {
        throw new BAD("Faculty");
      }

      // Time Valid
      const examtime = new Date(test.start_time);
      if (!is_eligible_to_get_result(examtime, test.full_time))
        throw new BAD("Time");

      const answer_sheets = await AnswerModel.find({
        test_id,
      }).populate([
        {
          path: "student",
          select: ["username", "name", "id"],
        },
        {
          path: "answers",
          populate: {
            path: "question",
            model: process.env.QUESTION_COLLECTION,
          },
        },
      ]);
      if (answer_sheets.length === 0)
        return res.status(200).json({ msg: "No Answer Data Found" });

      const students = await StudentModel.find({
        department: test.department,
        batch: test.batch,
      }).select("-password");
      if (students.length === 0)
        return res.status(200).json({ msg: "No Students Found" });

      let not_attended_students = [];

      // Checking If every student gave exam or not
      if (students.length > answer_sheets.length) {
        for (let i = 0; i < students.length; i++) {
          const found = answer_sheets.find((item) => {
            return item.student.username === students[i].username;
          });

          if (!found) {
            not_attended_students.push({
              student: students[i],
            });
          }
        }
      }

      return res.status(200).json({
        msg: "Successfully Fetched Test Data for review",
        data: { test, answer_sheets, not_attended: not_attended_students },
      });
    } catch (err) {
      return HandleError(err, res);
    }
  }
);

/////////////////////////////////////////////////////
// METHOD :: POST
// DESCRIPTION :: Give marks and write comments  on
//                a answer
// ACCESS :: Admin, Manager, Faculty
// EXPECTED PAYLOAD TYPE :: json/body
/////////////////////////////////////////////////////
router.post(
  "/test/review",
  check_for_access_token,
  _check_for_save_review_data,
  _allowAdminManagerFaculty,
  async (req, res) => {
    try {
      const {
        test_id,
        answer_id,
        question_id,
        comment,
        given_marks,
      } = req.body;

      let searchConstrains;
      if (req.user.role === "faculty") {
        searchConstrains = {
          _id: test_id,
          in_charge: req.user.id,
        };
      } else {
        searchConstrains = {
          _id: test_id,
        };
      }
      const test = await TestModel.findOne(searchConstrains);
      if (!test) throw new NOTFOUND("Test");

      // Time Valid
      const examtime = new Date(test.start_time);
      if (!is_eligible_to_get_result(examtime, test.full_time))
        throw new BAD("Time");

      // Fetching Answer Sheet
      const AnswerSheet = await AnswerModel.findOne({
        _id: answer_id,
        test_id: test_id,
      }).populate({
        path: "answers",
        populate: {
          path: "question",
          model: process.env.QUESTION_COLLECTION,
        },
      });
      if (!AnswerSheet) throw new NOTFOUND("Answer Sheet");

      AnswerSheet.answers.forEach((item) => {
        if (item.question.id === question_id) {
          if (
            item.question.mcq ||
            given_marks > item.question.mark ||
            given_marks < 0
          )
            throw new INVALID("Request");

          item.comment = comment;
          item.given_marks = given_marks;
          item.reviewed = true;
        }
      });

      await AnswerSheet.save();

      return res.status(200).json({
        msg: "Successfully Fetched Test Data for review",
      });
    } catch (err) {
      return HandleError(err, res);
    }
  }
);

module.exports = router;
