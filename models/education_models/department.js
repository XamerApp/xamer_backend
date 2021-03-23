const { Schema, SchemaTypes, model } = require("mongoose");
const { DEPARTMENT_COLLECTION } = process.env;

const department = Schema({
  name: SchemaTypes.String,
  short_name: SchemaTypes.String,
  semesters: SchemaTypes.Number,
});

module.exports = model(DEPARTMENT_COLLECTION, department);
