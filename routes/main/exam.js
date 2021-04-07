// Essential imports
const router = require("express").Router();
const { HandleError, NOTFOUND, BAD, INVALID } = require("../../utils/error");

const { check_for_access_token } = require("../../middlewares/auth");
const { _allowStudent } = require("../../middlewares/privilages");
const {
  _check_for_get_exam,
  _check_for_save_exam,
  _check_for_terminate_exam,
} = require("../../middlewares/validation");

// Models
const AnswerModel = require("../../models/main_models/answer");
const TestModel = require("../../models/main_models/test");
const StudentModel = require("../../models/user_models/student");
const {
  create_solo_answer_sheet,
  terminate_exam,
} = require("../../exam_ops/exam_ops");
const {
  is_eligible_to_start_exam,
  is_eligible_to_continue_exam,
} = require("../../utils/date_ops");

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

      // Time Valid
      const examtime = new Date(test.start_time);
      if (
        !is_eligible_to_start_exam(
          examtime,
          test.full_time,
          test.start_time_offset
        )
      )
        throw new BAD("Time");

      const ret = await create_solo_answer_sheet(test, student);

      if (!ret.operation) throw new INVALID("Request");
      if (ret.terminated) throw Error("Exam already terminated");

      // Checking if student can continue exam if answer sheet already exists
      if (
        ret.exists &&
        !is_eligible_to_continue_exam(ret.start_time, test.full_time)
      ) {
        await terminate_exam(test, student);
        throw new BAD("Time");
      }

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
      if (answersheet.terminated) throw Error("Exam already terminated");

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

/////////////////////////////////////////////////////
// METHOD :: POST
// DESCRIPTION :: Terminate Exam
// ACCESS :: Student
// EXPECTED PAYLOAD TYPE :: body/json
/////////////////////////////////////////////////////
router.post(
  "/exam/terminate",
  check_for_access_token,
  _check_for_terminate_exam,
  _allowStudent,
  async (req, res) => {
    try {
      // TODO Check EXAM TIME

      const { test_id } = req.body;
      const student = await StudentModel.findOne({
        username: req.user.username,
      });
      if (!student) throw new NOTFOUND("Student");

      await AnswerModel.updateOne(
        {
          test_id: test_id,
          student: student.id,
        },
        { terminated: true }
      );
      return res.status(200).json({
        msg: "Successfully Terminated",
      });
    } catch (err) {
      return HandleError(err, res);
    }
  }
);

module.exports = router;
