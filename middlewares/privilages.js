const _allowGOD = (req, res, next) => {
  if (req.body.GODKEY != process.env.GODKEY) {
    return res.status(400).json({ msg: "Bad User" });
  }
  next();
};

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

const _allowAdminManagerFaculty = (req, res, next) => {
  if (!req?.user?.role) return res.status(400).json({ msg: "Bad User" });

  if (
    req.user.role === "admin" ||
    req.user.role === "manager" ||
    req.user.role === "faculty"
  ) {
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

const _allowFacultyStudent = (req, res, next) => {
  if (
    !req?.user?.role ||
    (req.user.role !== "student" && req.user.role !== "faculty")
  )
    return res.status(400).json({ msg: "Bad User" });

  next();
};

module.exports = {
  _allowAdmin,
  _allowAdminManager,
  _allowAdminManagerFaculty,
  _allowFaculty,
  _allowStudent,
  _allowFacultyStudent,
  _allowGOD,
};
