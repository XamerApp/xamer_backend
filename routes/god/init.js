const router = require("express").Router();
const crypto = require("bcrypt");

// Middlewares
const { _allowGOD } = require("../../middlewares/privilages");
const { _middleware_initXamer } = require("../../utils/validationProps");

// Models
const XAMER_MODEL = require("../../models/xamer");

/////////////////////////////////////////////////////
// METHOD :: POST
// DESCRIPTION :: Initialize xamer for the first time
// ACCESS :: GOD KEY
// EXPECTED PAYLOAD TYPE :: body/json
/////////////////////////////////////////////////////
router.post("/init", _allowGOD, _middleware_initXamer, async (req, res) => {
  try {
    const count = await XAMER_MODEL.countDocuments();

    if (count > 0) {
      return res.status(400).json({
        msg: "Xamer already initialized. So God will not help now.",
      });
    }

    const { name, description, logo, mail_id, mail_notify } = req.body;

    const Xamer = new XAMER_MODEL({
      name,
      description,
      logo,
      mail_id,
      mail_notify,
    });
    const ret = await Xamer.save();

    return res.status(200).json({ msg: "Success", data: ret });
  } catch (err) {
    return res.status(500).json({ msg: err?.message ?? err });
  }
});

/////////////////////////////////////////////////////
// METHOD :: POST
// DESCRIPTION :: Initialize xamer for the first time
//                With no custom props
// ACCESS :: GOD KEY
// EXPECTED PAYLOAD TYPE :: body/json
/////////////////////////////////////////////////////
router.post("/init_default", _allowGOD, async (req, res) => {
  try {
    const count = await XAMER_MODEL.countDocuments();

    if (count > 0) {
      return res.status(400).json({
        msg: "Xamer already initialized. So God will not help now.",
      });
    }

    const Xamer = new XAMER_MODEL({});
    const ret = await Xamer.save();

    return res.status(200).json({ msg: "Success", data: ret });
  } catch (err) {
    return res.status(500).json({ msg: err?.message ?? err });
  }
});

module.exports = router;
