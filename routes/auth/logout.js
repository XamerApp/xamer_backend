// Essential imports
const router = require("express").Router();
const redisops = require("../../utils/redis_ops");

// Middlewares
const { check_for_access_token } = require("../../middlewares/auth");

/////////////////////////////////////////////////////
// METHOD :: DELETE
// DESCRIPTION :: Logout user
// ACCESS :: JWT only
// EXPECTED PAYLOAD TYPE :: body/json
/////////////////////////////////////////////////////
router.delete("/", check_for_access_token, async (req, res) => {
  // Calculating how much time requested token have
  const timeLeft = req.user.exp - Math.floor(new Date().getTime() / 1000);

  // Blacklisting the token
  await redisops.add_key(req.headers.authorization.split(" ")[1], timeLeft);

  res.status(200).json({ msg: "Successfully logged out." });
});

module.exports = router;
