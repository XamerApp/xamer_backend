const router = require("express").Router();

// Middlewares
const {
  _middleware_removeNotification,
} = require("../../utils/validationProps");
const { _allowAdminManagerFaculty } = require("../../middlewares/privilages");
const { HandleError, NOTFOUND, BAD } = require("../../utils/error");
const { check_for_access_token } = require("../../middlewares/auth");

// Models
const NotificationModel = require("../../models/notification");
const FacultyModel = require("../../models/user_models/faculty");

/////////////////////////////////////////////////////
// METHOD :: POST
// DESCRIPTION :: Remove notification
// ACCESS :: admin/manager/faculty
// EXPECTED PAYLOAD TYPE :: body/json
/////////////////////////////////////////////////////
router.post(
  "/remove",
  check_for_access_token,
  _allowAdminManagerFaculty,
  _middleware_removeNotification,
  async (req, res) => {
    try {
      const { id } = req.body;

      const notification = await NotificationModel.findById(id);
      if (!notification) throw new NOTFOUND("Notification");

      if (req.user.role === "faculty" && !notification.all) {
        const facultyExists = await FacultyModel.exists({
          username: req.user.username,
          departments: notification.department,
        });
        if (!facultyExists) throw new BAD("Faculty");
      }
      const ret = await notification.remove();

      return res
        .status(200)
        .json({ msg: "Notification Removed Successfully", data: ret });
    } catch (err) {
      return HandleError(err, res);
    }
  }
);

module.exports = router;
