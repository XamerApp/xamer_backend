const _allowAdmin = (req, res, next) => {
  if (!req?.user?.role || req.user.role !== "admin")
    return res.status(400).json({ msg: "Bad User" });

  next();
};

const _allowAdminManager = (req, res, next) => {
  if (!req?.user?.role) return res.status(400).json({ msg: "Bad User" });

  if (req.user.role === "admin" || req.user.role === "manager") {
    next();
    return;
  }

  return res.status(400).json({ msg: "Bad User" });
};

const _allowFaculty = (req, res, next) => {
  if (!req?.user?.role || req.user.role !== "faculty")
    return res.status(400).json({ msg: "Bad User" });

  next();
};

const _allowStudent = (req, res, next) => {
  if (!req?.user?.role || req.user.role !== "student")
    return res.status(400).json({ msg: "Bad User" });

  next();
};

module.exports = {
  _allowAdmin,
  _allowAdminManager,
  _allowFaculty,
  _allowStudent,
};
