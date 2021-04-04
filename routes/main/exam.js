// Essential imports
const router = require("express").Router();
const { HandleError, NOTFOUND, BAD, INVALID } = require("../../utils/error");

const { check_for_access_token } = require("../../middlewares/auth");
const { _allowStudent } = require("../../middlewares/privilages");
const {
  _check_for_get_exam,
  _check_for_save_exam,
} = require("../../middlewares/validation");

// Models
const AnswerModel = require("../../models/main_models/answer");
const TestModel = require("../../models/main_models/test");
const StudentModel = require("../../models/user_models/student");
const { create_solo_answer_sheet } = require("../../exam_ops/exam_ops");

/////////////////////////////////////////////////////
// METHOD :: POST
// DESCRIPTION :: Get exam questions
// ACCESS :: Student
// EXPECTED PAYLOAD TYPE :: body/json
/////////////////////////////////////////////////////
router.post(
  "/exam/start",
  check_for_access_token,
  _check_for_get_exam,
  _allowStudent,
  async (req, res) => {
    try {
      // TODO Check EXAM TIME

      const { test_id, student_id } = req.body;
      const test = await TestModel.findById(test_id);
      if (!test) throw new NOTFOUND("Requested Test");

      const student = await StudentModel.findOne({
        username: req.user.username,
      });
      if (!student) throw new NOTFOUND("Requested User");

      // Validations
      if (String(test.department) !== String(student.department))
        throw new NOTFOUND("Request Department in test");
      if (String(test.batch) !== String(student.batch))
        throw new NOTFOUND("Request Batch in test");

      const ret = await create_solo_answer_sheet(test, student);

      if (!ret) throw new INVALID("Request");

      const answersheet = await AnswerModel.findOne({
        test_id: test.id,
        student: student.id,
      }).populate({
        path: "answers",
        populate: {
          path: "question",
          model: process.env.QUESTION_COLLECTION,
          select: "-options.is_correct",
        },
      });

      return res.status(200).json({
        msg: "Successfully Fetched exam sheet",
        data: answersheet,
      });
    } catch (err) {
      return HandleError(err, res);
    }
  }
);

/////////////////////////////////////////////////////
// METHOD :: POST
// DESCRIPTION :: Save Answer of a question
// ACCESS :: Student
// EXPECTED PAYLOAD TYPE :: body/json
/////////////////////////////////////////////////////
router.post(
  "/exam/save",
  check_for_access_token,
  _check_for_save_exam,
  _allowStudent,
  async (req, res) => {
    try {
      // TODO Check EXAM TIME

      const {
        test_id,
        answer_id,
        answer_answered,
        answer_visited,
        answer_marked,
        answer_selection,
        answer_text,
      } = req.body;
      const test = await TestModel.findById(test_id);
      if (!test) throw new NOTFOUND("Requested Test");

      const student = await StudentModel.findOne({
        username: req.user.username,
      });
      if (!student) throw new NOTFOUND("Student");

      const answersheet = await AnswerModel.findOne({
        test_id: test_id,
        student: student.id,
      });
      if (!answersheet) throw new NOTFOUND("Requested Answer Sheet");

      let ans_found = false;

      for (let i = 0; i < answersheet.answers.length; i++) {
        if (answersheet.answers[i].id == answer_id) {
          answersheet.answers[i].answered = answer_answered;
          answersheet.answers[i].visited = answer_visited;
          answersheet.answers[i].marked = answer_marked;
          answersheet.answers[i].selection = answer_selection;
          answersheet.answers[i].text = answer_text;
          ans_found = true;
          break;
        }
      }
      if (!ans_found) throw new NOTFOUND("Requested Answer");

      await answersheet.save();
      return res.status(200).json({
        msg: "Successfully Saved",
      });
    } catch (err) {
      return HandleError(err, res);
    }
  }
);

module.exports = router;
