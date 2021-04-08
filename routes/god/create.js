const router = require("express").Router();
const crypto = require("bcrypt");

// Middlewares
const { _middleware_addAdmin } = require("../../utils/validationProps");

// Models
const AdminModel = require("../../models/user_models/admin");
const { _allowGOD } = require("../../middlewares/privilages");
const { is_username_exists } = require("../../middlewares/validation");

/////////////////////////////////////////////////////
// METHOD :: POST
// DESCRIPTION :: Register/Create Manager
// ACCESS :: Only Admins [TOKEN]
// EXPECTED PAYLOAD TYPE :: body/json
/////////////////////////////////////////////////////
router.post(
  "/admin",
  _allowGOD,
  _middleware_addAdmin,
  is_username_exists,
  async (req, res) => {
    try {
      const admins = await AdminModel.countDocuments();

      if (admins > 0)
        return res.status(400).json({
          msg: "Already 1 or more admin exists. So God will not help now.",
          data: {},
        });

      const username = req.body.username;
      const Admin = new AdminModel({
        name: req.body.name.trim(),
        username: username.toLowerCase().trim(),
        password: await crypto.hash(req.body.password.trim(), 10),
      });
      ret = await Admin.save();

      // Excluding Password while sending back to the client
      const retObj = ret.toObject();
      delete retObj.password;

      return res.status(200).json({ msg: "Success", data: retObj });
    } catch (err) {
      return res.status(500).json({ msg: err?.message ?? err });
    }
  }
);

module.exports = router;
