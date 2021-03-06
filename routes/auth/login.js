// Essential imports
const router = require("express").Router();
const JWT = require("jsonwebtoken");
const crypto = require("bcrypt");

// Database Models
const AdminModel = require("../../models/user_models/admin");
const ManagerModel = require("../../models/user_models/manager");
const FacultyModel = require("../../models/user_models/faculty");
const StudentModel = require("../../models/user_models/student");

// Middleware
const { check_for_credentials } = require("../../middlewares/auth");

// Helper Functions
const getUser = async (username) => {
  try {
    let ret;
    ret = await AdminModel.findOne({ username });
    if (!ret) ret = await ManagerModel.findOne({ username });
    if (!ret)
      ret = await FacultyModel.findOne({ username }).populate([
        { path: "departments" },
        { path: "subjects" },
      ]);
    if (!ret)
      ret = await StudentModel.findOne({ username }).populate([
        { path: "department" },
        { path: "batch" },
      ]);
    return ret;
  } catch (err) {
    console.error(err.message);
    return null;
  }
};

/////////////////////////////////////////////////////
// METHOD :: POST
// DESCRIPTION :: Login user
// ACCESS :: Public
// EXPECTED PAYLOAD TYPE :: body/json
/////////////////////////////////////////////////////
router.post("/", check_for_credentials, async (req, res) => {
  const username = req.body.username.toLowerCase().trim();
  const User = await getUser(username);

  if (!User) {
    res.status(400).json({ msg: "Username not found" });
  } else {
    const ret = await crypto.compare(req.body.password.trim(), User.password);

    if (ret) {
      const userInfo = {
        id: User.id,
        name: User.name,
        username: User.username,
        role: User.role,
        departments: User.role === "faculty" ? User.departments : null,
        subjects: User.role === "faculty" ? User.subjects : null,

        department: User.role === "student" ? User.department : null,
        batch: User.role === "student" ? User.batch : null,
      };
      res.status(200).json({
        msg: "Successfully Logged In",
        access_token: JWT.sign(userInfo, process.env.ACCESS_TOKEN_SECRET, {
          expiresIn: parseInt(process.env.TOKEN_VALIDITY),
        }),
        // refresh_token: JWT.sign(userInfo, process.env.REFRESH_TOKEN_SECRET),
        id: User.id,
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
