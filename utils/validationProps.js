const {
  string_prop,
  boolean_prop,
  object_prop,
  valid_data,
  number_prop,
} = require("./validateData");

const _loginProps = [string_prop("username"), string_prop("password")];

const _addProps = [
  string_prop("test_id"),
  string_prop("title"),
  boolean_prop("mcq"),
  boolean_prop("saq"),
  boolean_prop("baq"),
  string_prop("ans"),
  string_prop("note"),
  object_prop("options"),
];

const _addManagerProps = [
  string_prop("name"),
  string_prop("username"),
  string_prop("password"),
];

const _addStudentProps = [
  string_prop("name"),
  string_prop("username"),
  string_prop("password"),
  string_prop("email"),
  string_prop("roll"),
  number_prop("semester"),
  object_prop("department"),
  object_prop("batch"),
];

const _addFacultyProps = _addManagerProps;

const _addDepartmentProps = [
  string_prop("name"),
  string_prop("short_name"),
  number_prop("semesters"),
];

const _updateDepartmentProps = [
  string_prop("name"),
  string_prop("short_name"),
  number_prop("semesters"),
  string_prop("department_id"),
];

const _addBatchProps = [string_prop("name")];

const _addSubjectProps = [string_prop("name"), string_prop("paper_code")];

const _updateSubjectProps = [
  string_prop("name"),
  string_prop("paper_code"),
  string_prop("subject_id"),
];

const _addTestProps = [
  string_prop("name"),
  string_prop("in_charge"),
  string_prop("department"),
  string_prop("batch"),
  string_prop("subject"),
  number_prop("semester"),
  string_prop("start_time"),
  number_prop("start_time_offset"),
  number_prop("end_time_restrict"),
  number_prop("full_time"),
  boolean_prop("suffle"),
  boolean_prop("negative_marking"),
  number_prop("negative_value"),
  number_prop("negative_threshold"),

  object_prop("groups"),
  // object_prop("questions"),
  // object_prop("answers")
];

const _removeTestProps = [string_prop("id"), string_prop("in_charge")];

const _addQuestionProps = [
  string_prop("title"),
  string_prop("note"),
  boolean_prop("mcq"),
  boolean_prop("saq"),
  boolean_prop("baq"),
  number_prop("mark"),
  object_prop("options"),
  string_prop("test_id"),
];

const _removeQuestionProps = [
  string_prop("question_id"),
  string_prop("test_id"),
];

const _updateQuestionProps = [
  string_prop("title"),
  string_prop("note"),
  boolean_prop("mcq"),
  boolean_prop("saq"),
  boolean_prop("baq"),
  number_prop("mark"),
  object_prop("options"),
  string_prop("test_id"),
  string_prop("question_id"),
];

const _checkOptionsProps = [string_prop("name"), boolean_prop("is_correct")];

const _middleware_addManager = (req, res, next) => {
  if (valid_data(req.body, _addManagerProps)) {
    next();
  } else {
    res.status(400).json({ msg: "Invalid Data" });
  }
};

const _middleware_addStudent = (req, res, next) => {
  if (valid_data(req.body, _addStudentProps)) {
    next();
  } else {
    res.status(400).json({ msg: "Invalid Data" });
  }
};

const _middleware_addFaculty = (req, res, next) => {
  if (
    valid_data(req.query, _addFacultyProps) ||
    valid_data(req.body, _addFacultyProps)
  ) {
    next();
  } else {
    res.status(400).json({ msg: "Invalid Data" });
  }
};

module.exports = {
  _addProps,
  _addManagerProps,
  _addDepartmentProps,
  _updateDepartmentProps,
  _addBatchProps,
  _addSubjectProps,
  _updateSubjectProps,
  _addTestProps,
  _loginProps,
  _removeTestProps,
  _addQuestionProps,
  _updateQuestionProps,
  _removeQuestionProps,
  _checkOptionsProps,
  _middleware_addManager,
  _middleware_addStudent,
  _middleware_addFaculty,
};
