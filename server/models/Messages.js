const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema ({
    id: {
        type: String, 
        index: true
    }, 
    creationTime: Number, 
    name: String, 
    avatarUrl: String, 
    message: String
}, {
    _id: false
});

const messagesSchema = new mongoose.Schema ({
    messages: [messageSchema]
}, {
    collection: 'messagess'
});

const Messages = new mongoose.model("Messages", messagesSchema);

module.exports = Messages;