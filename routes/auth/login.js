// Essential imports
const router = require("express").Router();
const JWT = require("jsonwebtoken");
const crypto = require("bcrypt");

// Database Models
const AdminModel = require("../../models/user_models/admin");
const ManagerModel = require("../../models/user_models/manager");
const FacultyModel = require("../../models/user_models/faculty");
const StudentModel = require("../../models/user_models/student");

// Helper Functions
const getUser = async (username) => {
  let ret;
  ret = await AdminModel.findOne({ username });
  if (!ret) ret = await ManagerModel.findOne({ username });
  if (!ret) ret = await FacultyModel.findOne({ username });
  if (!ret) ret = await StudentModel.findOne({ username });
  return ret;
};

/////////////////////////////////////////////////////
// METHOD :: GET
// DESCRIPTION :: Login users
// ACCESS :: Public
// EXPECTED PAYLOAD TYPE :: query/string
/////////////////////////////////////////////////////
router.get("/", async (req, res) => {
  const username = req.query.username.toLowerCase().trim();
  const User = await getUser(username);

  if (!User) {
    res.status(400).json({ msg: "Username not found" });
  } else {
    const ret = await crypto.compare(req.query.password.trim(), User.password);

    if (ret) {
      const userInfo = {
        name: User.name,
        username: User.username,
        role: User.role,
      };
      res.status(200).json({
        msg: "Successfully Logged In",
        access_token: JWT.sign(userInfo, process.env.ACCESS_TOKEN_SECRET, {
          expiresIn: parseInt(process.env.TOKEN_VALIDITY),
        }),
        // refresh_token: JWT.sign(userInfo, process.env.REFRESH_TOKEN_SECRET),
        name: User.name,
        username: User.username,
        role: User.role,
      });
    } else {
      res.status(401).json({ msg: "Incorrect Password" });
    }
  }
});

module.exports = router;
