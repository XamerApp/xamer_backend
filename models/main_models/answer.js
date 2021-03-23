const { Schema, SchemaTypes, model } = require("mongoose");
const {
  ANSWER_COLLECTION,
  STUDENT_COLLECTION,
  QUESTION_COLLECTION,
} = process.env;

const answer_block_schema = Schema({
  question: { type: SchemaTypes.ObjectId, ref: QUESTION_COLLECTION },
  selection: { type: SchemaTypes.Number, default: null },
  text: { type: SchemaTypes.String, default: "" },
});

const answer_list_schema = Schema({
  student: { type: SchemaTypes.ObjectId, ref: STUDENT_COLLECTION },
  answers: [answer_block_schema],
});

const answer = Schema({
  test_id: SchemaTypes.String,
  answer_list: [answer_list_schema],
});

module.exports = model(ANSWER_COLLECTION, answer);
