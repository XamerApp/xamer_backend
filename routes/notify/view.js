const router = require("express").Router();

// Middlewares
const {
  _middleware_removeNotification,
} = require("../../utils/validationProps");
const { _allowAllUser } = require("../../middlewares/privilages");
const { HandleError, NOTFOUND, BAD } = require("../../utils/error");
const { check_for_access_token } = require("../../middlewares/auth");

// Models
const NotificationModel = require("../../models/notification");
const FacultyModel = require("../../models/user_models/faculty");
const StudentModel = require("../../models/user_models/student");

/////////////////////////////////////////////////////
// METHOD :: GET
// DESCRIPTION :: Get Notification
// ACCESS :: admin/manager/faculty/student
// EXPECTED PAYLOAD TYPE :: body/json
/////////////////////////////////////////////////////
router.get("/", check_for_access_token, _allowAllUser, async (req, res) => {
  try {
    if (req.user.role === "admin" || req.user.role === "manager") {
      const notifications = await NotificationModel.find({}).populate([
        {
          path: "seen",
          select: ["name", "username"],
        },
      ]);
      return res.status(200).json({
        msg: "Notification Fetched Successfully",
        data: notifications,
      });
    }

    if (req.user.role === "student") {
      const user = await StudentModel.findOne({
        username: req.user.username,
      });
      if (!user) throw new BAD("Student");

      const seen_notifications = await NotificationModel.find({
        $and: [
          {
            $or: [
              {
                department: user.department,
                batch: user.batch,
              },
              { all: true },
            ],
          },
          {
            seen: { $in: [user.id] },
          },
        ],
      }).select(["-seen"]);

      const unseen_notifications = await NotificationModel.find({
        $and: [
          {
            $or: [
              {
                department: user.department,
                batch: user.batch,
              },
              { all: true },
            ],
          },
          {
            seen: { $nin: [user.id] },
          },
        ],
      }).select(["-seen"]);

      return res.status(200).json({
        msg: "Notification Fetched Successfully",
        data: {
          seen: seen_notifications,
          unseen: unseen_notifications,
        },
      });
    }

    const user = await FacultyModel.findOne({ username: req.user.username });
    if (!user) throw new BAD("Faculty");

    let constrains = [];
    user.departments.forEach((item) => {
      constrains.push({ department: item });
    });
    constrains.push({ all: true });

    const notifications = await NotificationModel.find({
      $or: constrains,
    }).populate({
      path: "seen",
      select: ["name", "username"],
    });

    return res.status(200).json({
      msg: "Notification Fetched Successfully",
      data: notifications,
    });
  } catch (err) {
    return HandleError(err, res);
  }
});

module.exports = router;
