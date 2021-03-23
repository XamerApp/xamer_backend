const { SchemaTypes, model, Schema } = require("mongoose");
const { ADMIN_COLLECTION } = process.env;

const admin = Schema({
  name: SchemaTypes.String,
  username: SchemaTypes.String,
  password: SchemaTypes.String,
  role: { type: SchemaTypes.String, default: "admin" },
});

module.exports = model(ADMIN_COLLECTION, admin);
