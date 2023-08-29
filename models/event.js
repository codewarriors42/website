const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const eventSchema = new Schema({
  name: String,
});

const model = mongoose.model("event", eventSchema);

module.exports = model;
