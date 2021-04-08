const { Schema, SchemaTypes, model } = require("mongoose");
const {
  NOTIFICATION_COLLECTION,
  DEPARTMENT_COLLECTION,
  STUDENT_COLLECTION,
  BATCH_COLLECTION,
} = process.env;

const notification = Schema({
  name: { type: SchemaTypes.String, default: "Important Notice" },
  description: SchemaTypes.String,
  department: {
    type: SchemaTypes.ObjectId,
    ref: DEPARTMENT_COLLECTION,
    default: null,
  },
  batch: {
    type: SchemaTypes.ObjectId,
    ref: BATCH_COLLECTION,
    default: null,
  },
  all: { type: SchemaTypes.Boolean, default: true },
  seen: [{ type: SchemaTypes.ObjectId, ref: STUDENT_COLLECTION }],
  marked_seen: [{ type: SchemaTypes.ObjectId, ref: STUDENT_COLLECTION }],
  timestamp: { type: SchemaTypes.Date, default: new Date() },
});

module.exports = model(NOTIFICATION_COLLECTION, notification);
