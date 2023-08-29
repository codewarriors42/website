const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ArchiveSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  links: Array,
  event: {
    type: String,
    required: true,
  },
  competition: {
    type: String,
    required: false,
  },
  category: {
    type: String,
    required: true,
  },
  contributors: String,
  year: {
    type: Number,
    required: true,
  },
  image: String,
});

const model = mongoose.model("archive", ArchiveSchema);

module.exports = model;
