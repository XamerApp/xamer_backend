const { SchemaTypes, Schema, model } = require("mongoose");
const { QUESTION_COLLECTION } = process.env;

const option_schema = Schema({
  name: SchemaTypes.String,
  is_correct: SchemaTypes.Boolean,
});

const question = Schema({
  title: SchemaTypes.String,

  // Question Types
  mcq: SchemaTypes.Boolean,
  saq: SchemaTypes.Boolean,
  baq: SchemaTypes.Boolean,

  mark: SchemaTypes.Number,

  options: [option_schema],
  note: { type: SchemaTypes.String, default: "" },
});

module.exports = model(QUESTION_COLLECTION, question);
