const { Schema, SchemaTypes, model } = require("mongoose");
const {
  ANSWER_COLLECTION,
  STUDENT_COLLECTION,
  QUESTION_COLLECTION,
  TEST_COLLECTION,
} = process.env;

const answer_block_schema = Schema({
  question: { type: SchemaTypes.ObjectId, ref: QUESTION_COLLECTION },
  selection: { type: SchemaTypes.Number, default: null },
  text: { type: SchemaTypes.String, default: "" },
  visited: { type: SchemaTypes.Boolean, default: false },
  answered: { type: SchemaTypes.Boolean, default: false },
  marked: { type: SchemaTypes.Boolean, default: false },
  given_marks: { type: SchemaTypes.Number, default: 0 },
  reviewed: { type: SchemaTypes.Boolean, default: false },
  comment: { type: SchemaTypes.String, default: "" },
});

const answer = Schema({
  test_id: { type: SchemaTypes.ObjectId, ref: TEST_COLLECTION },
  student: { type: SchemaTypes.ObjectId, ref: STUDENT_COLLECTION },
  answers: [answer_block_schema],
  terminated: { type: SchemaTypes.Boolean, default: false },
  start_time: { type: SchemaTypes.Date, default: new Date() },
});

module.exports = model(ANSWER_COLLECTION, answer);
