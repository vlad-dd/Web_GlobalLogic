const mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

const UserSchema = mongoose.Schema({
    email: {type: String, unique: true, required: true},
    firstname: {type: String, required: true},
    lastname: {type: String, required: true},
    password: {type: String, required: true}
})

module.exports = mongoose.model('User', UserSchema);