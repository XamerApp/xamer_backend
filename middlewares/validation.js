// Props for validation check
const {
  _addDepartmentProps,
  _updateDepartmentProps,
  _addBatchProps,
  _addSubjectProps,
  _addTestProps,
  _removeTestProps,
  _addQuestionProps,
  _removeQuestionProps,
  _updateQuestionProps,
  _updateSubjectProps,
  _updateTestProps,
  _getExam,
  _saveExam,
  _getResult,
  _getTestReviewData,
} = require("../utils/validationProps");

// Database Models
const AdminModel = require("../models/user_models/admin");
const ManagerModel = require("../models/user_models/manager");
const FacultyModel = require("../models/user_models/faculty");
const StudentModel = require("../models/user_models/student");

const { valid_data } = require("../utils/validateData");
const e = require("express");

const _check_for_add_department = (req, res, next) => {
  if (valid_data(req.body, _addDepartmentProps)) {
    next();
  } else {
    res.status(400).json({ msg: "Invalid Data" });
  }
};

const _check_for_update_department = (req, res, next) => {
  if (valid_data(req.body, _updateDepartmentProps)) {
    next();
  } else {
    res.status(400).json({ msg: "Invalid Data" });
  }
};

const _check_for_add_batch = (req, res, next) => {
  if (valid_data(req.body, _addBatchProps)) {
    next();
  } else {
    res.status(400).json({ msg: "Invalid Data" });
  }
};

const _check_for_add_subject = (req, res, next) => {
  if (valid_data(req.body, _addSubjectProps)) {
    next();
  } else {
    res.status(400).json({ msg: "Invalid Data" });
  }
};

const _check_for_update_subject = (req, res, next) => {
  if (valid_data(req.body, _updateSubjectProps)) {
    next();
  } else {
    res.status(400).json({ msg: "Invalid Data" });
  }
};

const _check_for_add_test = (req, res, next) => {
  if (valid_data(req.body, _addTestProps)) {
    next();
  } else {
    res.status(400).json({ msg: "Invalid Data" });
  }
};

const _check_for_update_test = (req, res, next) => {
  if (valid_data(req.body, _updateTestProps)) {
    next();
  } else {
    res.status(400).json({ msg: "Invalid Data" });
  }
};

const _check_for_remove_test = (req, res, next) => {
  if (valid_data(req.query, _removeTestProps)) {
    next();
  } else {
    res.status(400).json({ msg: "Invalid Data" });
  }
};

const _check_for_add_question = (req, res, next) => {
  if (valid_data(req.body, _addQuestionProps)) {
    next();
  } else {
    res.status(400).json({ msg: "Invalid Data" });
  }
};

const _check_for_remove_question = (req, res, next) => {
  if (valid_data(req.body, _removeQuestionProps)) {
    next();
  } else {
    res.status(400).json({ msg: "Invalid Data" });
  }
};

const _check_for_update_question = (req, res, next) => {
  if (valid_data(req.body, _updateQuestionProps)) {
    next();
  } else {
    res.status(400).json({ msg: "Invalid Data" });
  }
};

// Exam middlewares
const _check_for_get_exam = (req, res, next) => {
  if (valid_data(req.body, _getExam)) {
    next();
  } else {
    res.status(400).json({ msg: "Invalid Data" });
  }
};

const _check_for_save_exam = (req, res, next) => {
  if (valid_data(req.body, _saveExam)) {
    next();
  } else {
    res.status(400).json({ msg: "Invalid Data" });
  }
};

const _check_for_terminate_exam = (req, res, next) => {
  if (valid_data(req.body, _getExam)) {
    next();
  } else {
    res.status(400).json({ msg: "Invalid Data" });
  }
};

const _check_for_get_result = (req, res, next) => {
  if (valid_data(req.query, _getResult)) {
    next();
  } else {
    res.status(400).json({ msg: "Invalid Data" });
  }
};

const _check_for_get_test_review_data = (req, res, next) => {
  if (valid_data(req.query, _getTestReviewData)) {
    next();
  } else {
    res.status(400).json({ msg: "Invalid Data" });
  }
};

// Middleware for checking if user exists or not
const is_username_exists = async (req, res, next) => {
  const username = req.query?.username ?? req.body?.username;
  const Admin = await AdminModel.exists({
    username: username.toLowerCase(),
  });

  const Manager = await ManagerModel.exists({
    username: username.toLowerCase(),
  });

  const Faculty = await FacultyModel.exists({
    username: username.toLowerCase(),
  });

  const Student = await StudentModel.exists({
    username: username.toLowerCase(),
  });

  if (!Admin && !Manager && !Faculty && !Student) {
    next();
  } else {
    res.status(400).json({
      msg: "Username already exists",
    });
  }
};

module.exports = {
  _check_for_add_department,
  _check_for_update_department,
  _check_for_add_batch,
  _check_for_add_subject,
  _check_for_update_subject,
  _check_for_add_test,
  _check_for_update_test,
  _check_for_remove_test,
  _check_for_add_question,
  _check_for_remove_question,
  _check_for_update_question,
  _check_for_get_exam,
  _check_for_save_exam,
  _check_for_terminate_exam,
  _check_for_get_result,
  _check_for_get_test_review_data,
  is_username_exists,
};
