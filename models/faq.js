const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FAQSchema = new Schema({
  question: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    required: true,
  },
});

const model = mongoose.model("faq", FAQSchema);

module.exports = model;
