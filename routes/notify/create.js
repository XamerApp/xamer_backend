const router = require("express").Router();

// Middlewares
const { _middleware_addNotification } = require("../../utils/validationProps");
const { _allowAdminManagerFaculty } = require("../../middlewares/privilages");
const { HandleError, NOTFOUND, BAD } = require("../../utils/error");
const { check_for_access_token } = require("../../middlewares/auth");

// Models
const NotificationModel = require("../../models/notification");
const DepartmentModel = require("../../models/education_models/department");
const BatchModel = require("../../models/education_models/batch");
const FacultyModel = require("../../models/user_models/faculty");

/////////////////////////////////////////////////////
// METHOD :: POST
// DESCRIPTION :: Create notification
// ACCESS :: admin/manager/faculty
// EXPECTED PAYLOAD TYPE :: body/json
/////////////////////////////////////////////////////
router.post(
  "/create",
  check_for_access_token,
  _allowAdminManagerFaculty,
  _middleware_addNotification,
  async (req, res) => {
    try {
      const { name, description, department, batch, all } = req.body;

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

      const notification = new NotificationModel({
        name,
        description,
        department: all ? null : department,
        batch: all ? null : batch,
        all,
      });
      const ret = await notification.save();

      return res
        .status(200)
        .json({ msg: "Notification Created Successfully", data: ret });
    } catch (err) {
      return HandleError(err, res);
    }
  }
);

module.exports = router;
