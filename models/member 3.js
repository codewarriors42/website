const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MemberSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    event: {
        type: String,
        required: true
    },
    socials: Array,
    image: String
});

const model = mongoose.model("member", MemberSchema);

module.exports = model;
