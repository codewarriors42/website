const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CompSchema = new Schema({
  name: String,
});

const model = mongoose.model("comp", CompSchema);

module.exports = model;
