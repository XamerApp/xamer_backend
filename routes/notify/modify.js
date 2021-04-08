const router = require("express").Router();

// Middlewares
const { _allowStudent } = require("../../middlewares/privilages");
const { HandleError, NOTFOUND, BAD } = require("../../utils/error");
const { check_for_access_token } = require("../../middlewares/auth");

// Models
const NotificationModel = require("../../models/notification");
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

module.exports = router;
