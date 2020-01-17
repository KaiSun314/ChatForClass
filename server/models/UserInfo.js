const mongoose = require('mongoose');

const userInfoSchema = new mongoose.Schema ({
    username: {
        type: String, 
        index: true
    }, 
    name: String, 
    avatarUrl: String, 
    isStudent: Boolean, 
    enrolledClassIds: [String], 
    enrolledClassNames: [String], 
    connectedSocketIds: [String]
});

const UserInfo = new mongoose.model("UserInfo", userInfoSchema);

module.exports = UserInfo;