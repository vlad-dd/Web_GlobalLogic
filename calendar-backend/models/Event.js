const mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

const EventSchema = mongoose.Schema({
    author: ObjectId,
    event: String,
    bkgColor: String,
    day: {type: String, enum:['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']},
    onEdit: Boolean
})

module.exports = mongoose.model('Event', EventSchema);