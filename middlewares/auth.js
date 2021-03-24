const JWT = require("jsonwebtoken");
const redisOps = require("../utils/redis_ops");

const { _loginProps } = require("../utils/validationProps");
const { valid_data } = require("../utils/validateData");

const check_for_credentials = (req, res, next) => {
  if (valid_data(req.body, _loginProps)) {
    next();
  } else {
    res.status(400).json({ msg: "Invalid Data" });
  }
};

// Not using right now
const check_for_refresh_token = (req, res, next) => {
  if (!req.body.refresh_token)
    return res.status(403).json({ msg: "Token Not found" });

  JWT.verify(
    req.body.refresh_token,
    process.env.REFRESH_TOKEN_SECRET,
    (err, payload) => {
      if (err)
        return res
          .status(403)
          .json({ msg: "Refresh Token is not valid. Login again." });
      req.user = payload;
    }
  );
  next();
};

const check_for_access_token = async (req, res, next) => {
  const auth_header = req.headers.authorization;
  if (!auth_header)
    return res.status(403).json({ msg: "Authorization header not found" });

  token = auth_header.split(" ")[1];

  const is_token_exists = await redisOps.is_exists(token);

  if (is_token_exists)
    return res
      .status(403)
      .json({ msg: "Your token is in blacklist. Login again" });

  JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, payload) => {
    if (err) return res.status(403).json({ msg: "Access token is invalid" });

    const is_username_exists = await redisOps.is_exists(payload.username);
    if (is_username_exists)
      return res
        .status(403)
        .json({ msg: "Your name is in blacklist. Login again" });

    req.user = payload;
    next();
  });
};

module.exports = {
  check_for_refresh_token,
  check_for_access_token,
  check_for_credentials,
};
