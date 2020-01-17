const mongoose = require('mongoose');

const enrolledClassSchema = new mongoose.Schema ({
    enrolledClassName: String, 
    conversationIds: [String], 
    conversationNames: [String]
});

const EnrolledClass = new mongoose.model("EnrolledClass", enrolledClassSchema);

module.exports = EnrolledClass;