const {
  string_prop,
  boolean_prop,
  object_prop,
  valid_data,
  number_prop,
} = require("./validateData");

const _initXamerProps = [
  string_prop("name"),
  string_prop("description"),
  string_prop("logo"),
  string_prop("mail_id"),
  boolean_prop("mail_notify"),
  string_prop("GODKEY"),
];

// Notification
const _addNotificationProps = [
  string_prop("name"),
  string_prop("description"),
  string_prop("department"),
  string_prop("batch"),
  boolean_prop("all"),
];

const _removeNotificationProps = [string_prop("id")];

const _updateNotificationProps = [
  string_prop("id"),
  string_prop("name"),
  string_prop("description"),
  string_prop("department"),
  string_prop("batch"),
  boolean_prop("all"),
];

const _seenNotificationProps = [string_prop("id")];

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

const _addAdminProps = _addManagerProps;

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
  boolean_prop("published"),
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

const _updateTestProps = [
  string_prop("test_id"),
  string_prop("name"),
  string_prop("in_charge"),
  boolean_prop("published"),
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

const _getExam = [string_prop("test_id")];

const _saveExam = [
  string_prop("test_id"),
  string_prop("answer_text"),
  number_prop("answer_selection"),
  boolean_prop("answer_marked"),
  boolean_prop("answer_visited"),
  boolean_prop("answer_answered"),
  string_prop("answer_id"),
];

const _getResult = [string_prop("test_id")];

const _getTestReviewData = [string_prop("test_id")];

const _checkOptionsProps = [string_prop("name"), boolean_prop("is_correct")];

const _middleware_initXamer = (req, res, next) => {
  if (valid_data(req.body, _initXamerProps)) {
    next();
  } else {
    res.status(400).json({ msg: "Invalid Data" });
  }
};

// Notifications
const _middleware_addNotification = (req, res, next) => {
  if (valid_data(req.body, _addNotificationProps)) {
    next();
  } else {
    res.status(400).json({ msg: "Invalid Data" });
  }
};

const _middleware_removeNotification = (req, res, next) => {
  if (valid_data(req.body, _removeNotificationProps)) {
    next();
  } else {
    res.status(400).json({ msg: "Invalid Data" });
  }
};

const _middleware_updateNotification = (req, res, next) => {
  if (valid_data(req.body, _updateNotificationProps)) {
    next();
  } else {
    res.status(400).json({ msg: "Invalid Data" });
  }
};

const _middleware_seenNotification = (req, res, next) => {
  if (valid_data(req.body, _seenNotificationProps)) {
    next();
  } else {
    res.status(400).json({ msg: "Invalid Data" });
  }
};

const _middleware_addAdmin = (req, res, next) => {
  if (valid_data(req.body, _addAdminProps)) {
    next();
  } else {
    res.status(400).json({ msg: "Invalid Data" });
  }
};

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
  _updateTestProps,
  _loginProps,
  _removeTestProps,
  _addQuestionProps,
  _updateQuestionProps,
  _removeQuestionProps,
  _checkOptionsProps,
  _getExam,
  _saveExam,
  _getResult,
  _getTestReviewData,
  _middleware_initXamer,
  _middleware_addNotification,
  _middleware_removeNotification,
  _middleware_updateNotification,
  _middleware_seenNotification,
  _middleware_addAdmin,
  _middleware_addManager,
  _middleware_addStudent,
  _middleware_addFaculty,
};
