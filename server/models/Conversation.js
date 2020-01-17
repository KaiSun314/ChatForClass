const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema ({
    conversationName: String, 
    conversationQuestion: String, 
    branchedConversationIds: [String], 
    branchedConversationNames: [String], 
    parentConversationId: String,  
    messagesId: String, 
    branchedMessageId: String
});

const Conversation = new mongoose.model("Conversation", conversationSchema);

module.exports = Conversation;

