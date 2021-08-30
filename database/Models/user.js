const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new mongoose.Schema({
    username: {type: String, trim: true, required: 'Username required', unique: true},
    password: {type: String, trim: true, required: 'Password required'},
    name: {type: String, default: "User"},
    surname: {type: String, default: "Userson"},
    dob: {type: Date, default: Date.now},
});

userSchema.plugin(uniqueValidator, {message: 'Username already taken'});

module.exports = mongoose.model("User", userSchema);