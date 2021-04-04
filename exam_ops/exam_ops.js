const AnswerModel = require("../models/main_models/answer");
const TestModel = require("../models/main_models/test");
const StudentModel = require("../models/user_models/student");
const { shuffle } = require("../utils/utils");

const remove_answer_sheet = async (test_id) => {
  try {
    const ret = await AnswerModel.deleteMany({ test_id });
    return !ret ? false : true;
  } catch (err) {
    return false;
  }
};

const create_answer_sheet = async (test_id) => {
  try {
    const test = await TestModel.findById(test_id);
    if (!test) return false;

    const students = await StudentModel.find({
      department: test.department,
      batch: test.batch,
    });
    if (!students) return false;

    let answers = [];

    for (let i = 0; i < students.length; i++) {
      const questions = shuffle(test.questions);
      let answer_items = [];
      for (let j = 0; j < questions.length; j++) {
        answer_items.push({
          question: questions[j],
        });
      }
      answers.push(
        new AnswerModel({
          test_id: test,
          student: students[i],
          answers: answer_items,
        })
      );
    }

    const ret = await AnswerModel.insertMany(answers);
    if (!ret) return false;

    return true;
  } catch (err) {
    return false;
  }
};

const create_solo_answer_sheet = async (test, student) => {
  try {
    const answer_sheet = await AnswerModel.findOne({
      test_id: test.id,
      student: student.id,
    });
    if (answer_sheet)
      return {
        exists: true,
        terminated: answer_sheet.terminated,
        operation: true,
      };

    const questions = test.suffle ? shuffle(test.questions) : test.questions;
    let answer_items = [];
    for (let j = 0; j < questions.length; j++) {
      answer_items.push({
        question: questions[j],
      });
    }

    const answer = new AnswerModel({
      test_id: test,
      student: student,
      answers: answer_items,
    });

    const ret = await answer.save();
    return { exists: false, terminated: false, operation: ret ? true : false };
  } catch (err) {
    return null;
  }
};

module.exports = {
  create_answer_sheet,
  remove_answer_sheet,
  create_solo_answer_sheet,
};
