const { Schema, SchemaTypes, model } = require("mongoose");
const {
  STUDENT_COLLECTION,
  DEPARTMENT_COLLECTION,
  BATCH_COLLECTION,
} = process.env;

const student = Schema({
  name: SchemaTypes.String,
  email: SchemaTypes.String,
  username: SchemaTypes.String,
  password: SchemaTypes.String,
  role: { type: SchemaTypes.String, default: "student" },
  roll: SchemaTypes.String,
  semester: SchemaTypes.Number,
  department: {
    type: SchemaTypes.ObjectId,
    ref: DEPARTMENT_COLLECTION,
  },
  batch: { type: SchemaTypes.ObjectId, ref: BATCH_COLLECTION },
});

module.exports = model(STUDENT_COLLECTION, student);
