const { SchemaTypes, model, Schema } = require("mongoose");
const { MANAGER_COLLECTION } = process.env;

const manager = Schema({
  name: SchemaTypes.String,
  username: SchemaTypes.String,
  password: SchemaTypes.String,
  role: { type: SchemaTypes.String, default: "manager" },
});

module.exports = model(MANAGER_COLLECTION, manager);
