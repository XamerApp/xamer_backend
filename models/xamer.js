const { Schema, SchemaTypes, model } = require("mongoose");
const { XAMER_COLLECTION } = process.env;

const xamer = Schema({
  name: { type: SchemaTypes.String, default: "Xamer" },
  description: {
    type: SchemaTypes.String,
    default:
      "Xamer is a online exam platform created by a group of college students. For more info visit xamerapp.github.io",
  },
  logo: {
    type: SchemaTypes.String,
    default: "https://avatars.githubusercontent.com/u/72588804?s=200&v=4",
  },
  mail_id: { type: SchemaTypes.String, default: "dummy@gmail.com" },
  mail_notify: { type: SchemaTypes.Boolean, default: false },
});

module.exports = model(XAMER_COLLECTION, xamer);
