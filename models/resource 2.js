const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ResourceSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    dark: String,
    light: String
});

const model = mongoose.model("resource", ResourceSchema);

module.exports = model;
