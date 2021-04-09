const router = require("express").Router();

// Middlewares
const {
  _middleware_updateNotification,
} = require("../../utils/validationProps");
const {
  _allowStudent,
  _allowAdminManagerFaculty,
} = require("../../middlewares/privilages");
const { HandleError, NOTFOUND, BAD } = require("../../utils/error");
const { check_for_access_token } = require("../../middlewares/auth");

// Models
const NotificationModel = require("../../models/notification");
const DepartmentModel = require("../../models/education_models/department");
const BatchModel = require("../../models/education_models/batch");
const FacultyModel = require("../../models/user_models/faculty");
const StudentModel = require("../../models/user_models/student");

/////////////////////////////////////////////////////
// METHOD :: POST
// DESCRIPTION :: Make notification seen
// ACCESS :: student
// EXPECTED PAYLOAD TYPE :: body/json
/////////////////////////////////////////////////////
router.post(
  "/seen",
  check_for_access_token,
  _allowStudent,
  async (req, res) => {
    try {
      const notification = await NotificationModel.findById(req.body.id);
      if (!notification) throw new NOTFOUND("Requested Notification");

      const user = await StudentModel.findOne({ username: req.user.username });
      if (!user) throw new BAD("Student");

      if (
        !notification.all &&
        (user.department != notification.department ||
          user.batch != notification.batch)
      ) {
        throw new BAD("Student");
      }

      const ret = await NotificationModel.findOneAndUpdate(
        {
          _id: req.body.id,
          seen: { $nin: [user.id] },
        },
        { $push: { seen: user.id } }
      );

      return res.status(200).json({
        msg: "Successful",
        data: ret,
      });
    } catch (err) {
      return HandleError(err, res);
    }
  }
);

/////////////////////////////////////////////////////
// METHOD :: POST
// DESCRIPTION :: Update notification
// ACCESS :: admin/manager/faculty
// EXPECTED PAYLOAD TYPE :: body/json
/////////////////////////////////////////////////////
router.post(
  "/update",
  check_for_access_token,
  _allowAdminManagerFaculty,
  _middleware_updateNotification,
  async (req, res) => {
    try {
      const { id, name, description, department, batch, all } = req.body;

      // Checking batch and department exists w
      if (!all) {
        const department_exists = await DepartmentModel.findById(department);
        if (!department_exists) throw new NOTFOUND("Department");

        const batch_exists = await BatchModel.findById(batch);
        if (!batch_exists) throw new NOTFOUND("Batch");

        // Checking if faculty is under requested department
        if (req.user.role === "faculty") {
          const faculty_exists = await FacultyModel.exists({
            username: req.user.username,
            departments: department,
          });
          if (!faculty_exists) throw new BAD("faculty");
        }
      }

      await NotificationModel.findByIdAndUpdate(id, {
        name,
        description,
        department: all ? null : department,
        batch: all ? null : batch,
        all,
        seen: [],
      });

      return res.status(200).json({ msg: "Notification Updated Successfully" });
    } catch (err) {
      return HandleError(err, res);
    }
  }
);

module.exports = router;
