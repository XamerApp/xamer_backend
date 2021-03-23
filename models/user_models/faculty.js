const { Schema, SchemaTypes, model } = require("mongoose");
const {
  FACULTY_COLLECTION,
  DEPARTMENT_COLLECTION,
  SUBJECT_COLLECTION,
} = process.env;

const faculty = Schema({
  name: SchemaTypes.String,
  username: SchemaTypes.String,
  password: SchemaTypes.String,
  departments: [{ type: SchemaTypes.ObjectId, ref: DEPARTMENT_COLLECTION }],
  subjects: [{ type: SchemaTypes.ObjectId, ref: SUBJECT_COLLECTION }],
  role: { type: SchemaTypes.String, default: "faculty" },
});

module.exports = model(FACULTY_COLLECTION, faculty);
