// Props for validation check
const {
  _addDepartmentProps,
  _addBatchProps,
  _addSubjectProps,
  _addTestProps,
  _removeTestProps,
  _addQuestionProps,
} = require("../utils/validationProps");

// Database Models
const AdminModel = require("../models/user_models/admin");
const ManagerModel = require("../models/user_models/manager");
const FacultyModel = require("../models/user_models/faculty");
const StudentModel = require("../models/user_models/student");

const { valid_data } = require("../utils/validateData");

const _check_for_add_department = (req, res, next) => {
  if (valid_data(req.body, _addDepartmentProps)) {
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

const _check_for_add_test = (req, res, next) => {
  if (valid_data(req.body, _addTestProps)) {
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
  if (valid_data(req.query, _addQuestionProps)) {
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
  _check_for_add_batch,
  _check_for_add_subject,
  _check_for_add_test,
  _check_for_remove_test,
  _check_for_add_question,
  is_username_exists,
};