const { Schema, SchemaTypes, model } = require("mongoose");
const { BATCH_COLLECTION } = process.env;
const batch = Schema({
  name: SchemaTypes.String,
});

module.exports = model(BATCH_COLLECTION, batch);
