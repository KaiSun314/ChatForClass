const UserInfo = require('./models/UserInfo');
const EnrolledClass = require('./models/EnrolledClass');
const Conversation = require('./models/Conversation');
const Messages = require('./models/Messages');
const redis = require('redis');
const uuid = require('uuid/v1');

const client = redis.createClient();

async function socketConnection(io) {
    io.on('connection', async (socket) => {
        const username = socket.handshake.query.username;
        UserInfo.updateOne(
            {username: username}, 
            {$push: {connectedSocketIds: socket.id}},
            (err, result) => {
                client.del("userinfos_" + username);
                if (err) console.log(err + " at line 13");
            }
        );

        let userInfo;
        const info = await UserInfo.findOne({username: username}).cache();
        
        userInfo = info;
        socket.emit('userInfo', userInfo);

        socket.on('addClass', (username, newClassName) => {
            const newEnrolledClass = new EnrolledClass({
                enrolledClassName: newClassName, 
                conversationIds: [], 
                conversationNames: []
            });
            newEnrolledClass.save((err, enrolledClass) => {
                setupClass(enrolledClass._id);
                if (!err) {
                    UserInfo.updateOne(
                        {username: username}, 
                        {$push: {enrolledClassIds: enrolledClass._id, enrolledClassNames: enrolledClass.enrolledClassName}}, 
                        (err, result) => {
                            client.del("userinfos_" + username);
                            socket.emit('addClassResponse', enrolledClass._id, enrolledClass.enrolledClassName);
                        }
                    );
                } else {
                    console.log("Error adding new class to user " + username + " at line 29");
                }
            });
        });

        socket.on('addStudents', (studentEmails, curClassId, curClassName) => {
            let studentEmailArray = studentEmails.split(/\s+/).filter(email => email.length > 0);
            studentEmailArray.forEach(async (email) => {
                UserInfo.updateOne(
                    {username: email}, 
                    {$push: {enrolledClassIds: curClassId, enrolledClassNames: curClassName}},
                    (err, result) => {
                        client.del("userinfos_" + email);
                        if (err) console.log(err + " at line 56");
                    }
                );
                const userInfo = await UserInfo.findOne({username: email}).cache();

                userInfo.connectedSocketIds.forEach(socketId => {
                    io.to(socketId).emit("classAddedStudent", curClassId, curClassName);
                });
            });
        });

        socket.on('disconnect', reason => {
            UserInfo.updateOne(
                {username: username}, 
                {$pull: {connectedSocketIds: {$in: [socket.id]}}},
                (err, result) => {
                    client.del("userinfos_" + username);
                    if (err) console.log(err + " at line 76");
                }
            );
        });
    });
    
    const enrolledClasses = await EnrolledClass.find({});

    enrolledClasses.forEach(enrolledClass => {
        setupClass(enrolledClass._id);
    });

    function setupClass(enrolledClassId) {
        io.of("/" + enrolledClassId).on('connection', async (classSocket) => {
            const name = classSocket.handshake.query.name;
            const avatarUrl = classSocket.handshake.query.avatarUrl;

            const enrolledClass = await EnrolledClass.findOne({_id: enrolledClassId}).cache();

            classSocket.emit('startConversationList', enrolledClass);

            classSocket.on('joinConversation', async (conversationId) => {
                if (Object.keys(classSocket.rooms).length > 1) {
                    const conversationToLeave = Object.keys(classSocket.rooms)[1];
                    classSocket.leave(conversationToLeave, () => {
                        classSocket.join(conversationId);
                    });
                } else {
                    classSocket.join(conversationId);
                }                    

                const conversationInfo = await Conversation.findOne({_id: conversationId}).cache();
                
                const messageInfo = await Messages.findOne({_id: conversationInfo.messagesId});
                
                classSocket.emit('conversationInfo', conversationInfo, messageInfo);
            });

            classSocket.on('newMessage', async (msg) => {
                const fullMsg = {
                    id: uuid(), 
                    creationTime: Date.now(), 
                    name: name, 
                    avatarUrl: avatarUrl, 
                    message: msg
                };

                const conversationId = Object.keys(classSocket.rooms)[1];
                
                const conversationInfo = await Conversation.findOne({_id: conversationId}).cache();
                
                Messages.updateOne(
                    {_id: conversationInfo.messagesId}, 
                    {$push: {messages: fullMsg}}, 
                    (err, result) => {
                        io.of("/" + enrolledClass._id).to(conversationId).emit('messageToClients', fullMsg);
                    }
                );
            });

            classSocket.on('getBranches', async (conversationId) => {
                const conversationInfo = await Conversation.findOne({_id: conversationId}).cache();
                
                classSocket.emit('tellBranches', conversationInfo.conversationName, conversationInfo.branchedConversationIds, conversationInfo.branchedConversationNames);
            });

            classSocket.on('getParent', async (conversationId) => {
                const conversationInfo = await Conversation.findOne({_id: conversationId}).cache();
                
                if (conversationInfo.parentConversationId === "null") {
                    const enrolledClassUpdated = await EnrolledClass.findOne({_id: enrolledClass._id}).cache();
                    
                    classSocket.emit('tellParent', "", enrolledClassUpdated.enrolledClassName, enrolledClassUpdated.conversationIds, enrolledClassUpdated.conversationNames);
                } else {
                    const conversationInfoParent = await Conversation.findOne({_id: conversationInfo.parentConversationId}).cache();
                    
                    classSocket.emit('tellParent', conversationInfoParent._id, conversationInfoParent.conversationName, conversationInfoParent.branchedConversationIds, conversationInfoParent.branchedConversationNames);
                }
            });

            classSocket.on('addConversation', (classId, conversationId, conversationName, conversationQuestion, branchedMessageId) => {
                if (conversationId === "") {
                    const messages = new Messages();
                    messages.save((err, newMessage) => {
                        const conversation = new Conversation({
                            conversationName: conversationName, 
                            conversationQuestion: conversationQuestion, 
                            branchedConversationIds: [], 
                            branchedConversationNames: [], 
                            parentConversationId: "null",  
                            messagesId: newMessage._id, 
                            branchedMessageId: (branchedMessageId ? branchedMessageId : "null")
                        });

                        conversation.save((err2, newConversation) => {
                            EnrolledClass.updateOne(
                                {_id: classId}, 
                                {$push: {conversationNames: newConversation.conversationName, conversationIds: newConversation._id}}, 
                                (err, result) => {
                                    client.del("enrolledclasses_" + classId);
                                    if (err) console.log(err + " at line 195");
                                    else {
                                        io.of("/" + classId).emit('addConversationResponse', "", newConversation);
                                        classSocket.emit('addConversationResponseSender', "", newConversation);
                                    }
                                }
                            );
                        });

                    });
                } else {
                    const messages = new Messages();
                    messages.save((err, newMessage) => {
                        const conversation = new Conversation({
                            conversationName: conversationName, 
                            conversationQuestion: conversationQuestion, 
                            branchedConversationIds: [], 
                            branchedConversationNames: [], 
                            parentConversationId: conversationId,  
                            messagesId: newMessage._id, 
                            branchedMessageId: (branchedMessageId ? branchedMessageId : "null")
                        });

                        conversation.save((err2, newConversation) => {
                            Conversation.updateOne(
                                {_id: conversationId}, 
                                {$push: {branchedConversationNames: newConversation.conversationName, branchedConversationIds: newConversation._id}}, 
                                (err, result) => {
                                    client.del("conversations_" + conversationId);
                                    if (err) console.log(err + " at line 220");
                                    else {
                                        io.of("/" + classId).emit('addConversationResponse', conversationId, newConversation);
                                        classSocket.emit('addConversationResponseSender', conversationId, newConversation);
                                    }
                                }
                            );
                        });

                    });
                }
            });

            classSocket.on('getConversationBranches', async (conversationId) => {
                const conversationInfo = await Conversation.findOne({_id: conversationId}).cache();
                
                classSocket.emit('getConversationBranchesResponse', conversationInfo);
            });
        });
    }
}

module.exports = socketConnection;