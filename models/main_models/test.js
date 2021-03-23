const { Schema, SchemaTypes, model } = require("mongoose");
const {
  TEST_COLLECTION,
  FACULTY_COLLECTION,
  BATCH_COLLECTION,
  QUESTION_COLLECTION,
  SUBJECT_COLLECTION,
  ANSWER_COLLECTION,
} = process.env;

const groupSchema = Schema({
  name: SchemaTypes.String,
  sections: [SchemaTypes.String],
});

const test = Schema({
  name: SchemaTypes.String,
  in_charge: { type: SchemaTypes.ObjectId, ref: FACULTY_COLLECTION },

  // Test Indentification props
  department: { type: SchemaTypes.ObjectId, ref: FACULTY_COLLECTION },
  batch: { type: SchemaTypes.ObjectId, ref: BATCH_COLLECTION },
  subject: { type: SchemaTypes.ObjectId, ref: SUBJECT_COLLECTION },
  semester: SchemaTypes.Number,

  // Time props
  start_time: {
    type: SchemaTypes.Date,
    default: Date.now().toString(),
  },
  start_time_offset: SchemaTypes.Number, // in Hour
  end_time_restrict: SchemaTypes.Number, // in hour
  full_time: SchemaTypes.Number, // in minitue

  suffle: SchemaTypes.Boolean,
  // Negative Marking Props
  negative_marking: SchemaTypes.Boolean,
  negative_value: SchemaTypes.Number,
  negative_threshold: SchemaTypes.Number,

  // Question Grouping
  groups: [groupSchema],

  // Question
  questions: [{ type: SchemaTypes.ObjectId, ref: QUESTION_COLLECTION }],
  answers: [{ type: SchemaTypes.ObjectId, ref: ANSWER_COLLECTION }],
});

module.exports = model(TEST_COLLECTION, test);
