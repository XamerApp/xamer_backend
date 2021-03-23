const { Schema, SchemaTypes, model } = require("mongoose");
const { SUBJECT_COLLECTION } = process.env;
const subject = Schema({
  name: SchemaTypes.String,
  paper_code: SchemaTypes.String,
});

module.exports = model(SUBJECT_COLLECTION, subject);
