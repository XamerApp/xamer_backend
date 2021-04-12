// Essential imports
const router = require("express").Router();
const { HandleError, NOTFOUND, BAD } = require("../../utils/error");

const { check_for_access_token } = require("../../middlewares/auth");
const { _allowStudent } = require("../../middlewares/privilages");
const { _check_for_get_result } = require("../../middlewares/validation");

// Models
const AnswerModel = require("../../models/main_models/answer");
const TestModel = require("../../models/main_models/test");
const StudentModel = require("../../models/user_models/student");
const { is_eligible_to_get_result } = require("../../utils/date_ops");

/////////////////////////////////////////////////////
// METHOD :: GET
// DESCRIPTION :: Get exam result
// ACCESS :: Student
// EXPECTED PAYLOAD TYPE :: query/string
/////////////////////////////////////////////////////
router.get(
  "/result",
  check_for_access_token,
  _check_for_get_result,
  _allowStudent,
  async (req, res) => {
    try {
      const { test_id } = req.query;
      const test = await TestModel.findById(test_id);
      if (!test) throw new NOTFOUND("Requested Test");

      const student = await StudentModel.findOne({
        username: req.user.username,
      });
      if (!student) throw new NOTFOUND("Requested User");

      const answersheet = await AnswerModel.findOne({
        test_id,
        student: student.id,
      }).populate({
        path: "answers",
        populate: {
          path: "question",
          model: process.env.QUESTION_COLLECTION,
        },
      });
      if (!answersheet) throw new NOTFOUND("Result");

      // Time Valid
      const examtime = new Date(test.start_time);
      if (!is_eligible_to_get_result(examtime, test.full_time))
        throw new BAD("Time");

      return res.status(200).json({
        msg: "Successfully Fetched Result",
        data: answersheet,
      });
    } catch (err) {
      return HandleError(err, res);
    }
  }
);

module.exports = router;
