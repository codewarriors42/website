const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ContactSchema = new Schema({
    post: {
        type: String,
        required: true
    },
    mail: {
        type: String,
        required: true
    }
});

const model = mongoose.model("contact", ContactSchema);

module.exports = model;