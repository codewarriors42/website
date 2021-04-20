const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    isSupreme: {
        type: Boolean,
        required: true
    }
});

const model = mongoose.model("User", UserSchema);

module.exports = model;
