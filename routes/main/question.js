// Essential Imports
const router = require("express").Router();

// Middlewares
const {
  _check_for_remove_test,
  _check_for_add_question,
  _check_for_remove_question,
  _check_for_update_question,
} = require("../../middlewares/validation");
const { _allowFaculty } = require("../../middlewares/privilages");
const { check_for_access_token } = require("../../middlewares/auth");

// Validation Props
const { valid_data } = require("../../utils/validateData");
const { _checkOptionsProps } = require("../../utils/validationProps");

// Exception classes
const {
  NOTFOUND,
  EXISTS,
  INVALID,
  HandleError,
  BAD,
} = require("../../utils/error");

// Database Models
const BatchModel = require("../../models/education_models/batch");
const DepartmentModel = require("../../models/education_models/department");
const SubjectModel = require("../../models/education_models/subject");
const TestModel = require("../../models/main_models/test");
const FacultyModel = require("../../models/user_models/faculty");
const QuestionModel = require("../../models/main_models/question");

const is_type_valid = (type1, type2, type3) => {
  if (
    (type1 && type2) ||
    (type2 && type3) ||
    (type1 && type3) ||
    (type1 && type2 && type3)
  ) {
    return false;
  }
  if (type1 || type2 || type3) {
    return true;
  }
  return false;
};

const is_options_valid = (options) => {
  if (options.length === 0) return true;

  let trueCount = 0;

  for (let i = 0; i < options.length; i++) {
    if (!valid_data(options[i], _checkOptionsProps)) {
      return false;
    }

    if (options[i].is_correct) trueCount++;
  }

  return trueCount === 1 ? true : false;
};

const is_group_valid = (groups, group_name) => {
  const x = groups.find((item) => {
    return item.name === group_name;
  });
  return x ? true : false;
};

const is_section_valid = (groups, group_name, section_name) => {
  const x = groups.find((item) => {
    return item.name === group_name;
  });

  const y = x.sections.find((item) => {
    return item === section_name;
  });

  return y ? true : false;
};

/////////////////////////////////////////////////////
// METHOD :: POST
// DESCRIPTION :: Add question
// ACCESS :: Faculty
// EXPECTED PAYLOAD TYPE :: body/json
/////////////////////////////////////////////////////
router.post(
  "/question",
  check_for_access_token,
  _allowFaculty,
  _check_for_add_question,
  async (req, res) => {
    try {
      const qBLK = req.body;

      // Checking if requested test available or not
      const Test = await TestModel.findById(qBLK.test_id).populate([
        { path: "questions" },
        { path: "in_charge", select: ["username"] },
      ]);
      if (!Test) throw new NOTFOUND("Test");

      // Checking if question is exists into the test or not
      const is_question_exists = Test.questions.find((item) => {
        return item.title === qBLK.title;
      });
      if (Boolean(is_question_exists)) {
        throw new EXISTS("Question");
      }

      // Checking if faculty is same as the in_charge of test
      if (Test.in_charge.username !== req.user.username) throw new BAD("User");

      // Checking if question type is valid or not
      if (!is_type_valid(qBLK.mcq, qBLK.saq, qBLK.baq))
        throw new INVALID("Question Type");

      // Checking if question have valid options
      if (!is_options_valid(qBLK.options))
        throw new INVALID("Question Options");

      // If Question provides any group then is that group valid
      if (!is_group_valid(Test.groups, qBLK?.group ?? Test.groups[0].name))
        throw new INVALID("Selected Group");

      // If Question provides any group then is that section valid
      if (
        !is_section_valid(
          Test.groups,
          qBLK?.group ?? Test.groups[0].name,
          qBLK?.section ?? Test.groups[0].sections[0]
        )
      )
        throw new INVALID("Selected Section");

      const Question = new QuestionModel({
        title: qBLK.title,
        note: qBLK.note,
        mcq: qBLK.mcq,
        saq: qBLK.saq,
        baq: qBLK.baq,
        mark: qBLK.mark,
        group: qBLK?.group ?? Test.groups[0].name,
        section: qBLK?.section ?? Test.groups[0].sections[0],
        options: qBLK?.options ?? [],
      });
      const ret = await Question.save();

      // Pushing the question into test
      Test.questions.push(Question);
      await Test.save();

      return res
        .status(200)
        .json({ msg: "Question successfully added", data: ret });
    } catch (err) {
      return HandleError(err, res);
    }
  }
);

/////////////////////////////////////////////////////
// METHOD :: DELETE
// DESCRIPTION :: Delete question
// ACCESS :: Faculty
// EXPECTED PAYLOAD TYPE :: body/json
/////////////////////////////////////////////////////
router.delete(
  "/question",
  check_for_access_token,
  _allowFaculty,
  _check_for_remove_question,
  async (req, res) => {
    try {
      const qBLK = req.body;

      // Checking if requested test available or not
      const Test = await TestModel.findById(qBLK.test_id).populate([
        { path: "in_charge", select: ["username"] },
      ]);
      if (!Test) throw new NOTFOUND("Test");

      // Checking if faculty is same as the in_charge of test
      if (Test.in_charge.username !== req.user.username) throw new BAD("User");

      // Checking if question is available in question collection
      const Question = await QuestionModel.findById(qBLK.question_id);
      if (!Question) throw new NOTFOUND("Question in Question Collection");

      // Pulling question from test
      Test.questions.pull({ _id: qBLK.question_id });
      await Test.save();

      const ret = await QuestionModel.findByIdAndDelete(qBLK.question_id);

      return res
        .status(200)
        .json({ msg: "Question successfully removed from test", data: ret });
    } catch (err) {
      return HandleError(err, res);
    }
  }
);

/////////////////////////////////////////////////////
// METHOD :: PUT
// DESCRIPTION :: Update Question
// ACCESS :: Faculty
// EXPECTED PAYLOAD TYPE :: body/json
/////////////////////////////////////////////////////
router.put(
  "/question",
  check_for_access_token,
  _allowFaculty,
  _check_for_update_question,
  async (req, res) => {
    try {
      const qBLK = req.body;

      // Checking if requested test available or not
      const Test = await TestModel.findById(qBLK.test_id).populate([
        { path: "in_charge", select: ["username"] },
      ]);
      if (!Test) throw new NOTFOUND("Test");

      // Checking if faculty is same as the in_charge of test
      if (Test.in_charge.username !== req.user.username) throw new BAD("User");

      // Checking if question is available in question collection
      const Question = await QuestionModel.findById(qBLK.question_id);
      if (!Question) throw new NOTFOUND("Question in Question Collection");

      // Checking if question type is valid or not
      if (!is_type_valid(qBLK.mcq, qBLK.saq, qBLK.baq))
        throw new INVALID("Question Type");

      // Checking if question have valid options
      if (!is_options_valid(qBLK.options))
        throw new INVALID("Question Options");

      // If Question provides any group then is that group valid
      if (!is_group_valid(Test.groups, qBLK?.group ?? Test.groups[0].name))
        throw new INVALID("Selected Group");

      // If Question provides any group then is that section valid
      if (
        !is_section_valid(
          Test.groups,
          qBLK?.group ?? Test.groups[0].name,
          qBLK?.section ?? Test.groups[0].sections[0]
        )
      )
        throw new INVALID("Selected Section");

      if (Question.title !== qBLK.title) {
        const found = await QuestionModel.exists({ title: qBLK.title });
        if (found) throw new EXISTS("Same Question Title");
      }

      // Assigning new values into question
      Question.title = qBLK.title;
      Question.note = qBLK.note;
      Question.mcq = qBLK.mcq;
      Question.saq = qBLK.saq;
      Question.baq = qBLK.baq;
      Question.mark = qBLK.mark;
      Question.options = qBLK?.options ?? Question.options;
      Question.section = qBLK?.section ?? Question.section;
      Question.group = qBLK?.group ?? Question.group;

      const ret = await Question.save();

      return res
        .status(200)
        .json({ msg: "Question successfully updated", data: ret });
    } catch (err) {
      return HandleError(err, res);
    }
  }
);
module.exports = router;
