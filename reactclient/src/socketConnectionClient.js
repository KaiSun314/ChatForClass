import io from 'socket.io-client';
import $ from 'jquery';

function socketConnection(username, setConversation, setConversationNameList, setConversationIdList, setConversationName, setMessages, setStudent, setShowCreateClass, setShowAddStudents, setShowAddConversations, setConversationQuestion, setConversationBranchedMessageId) {
    const socket = io('http://localhost:5000', {
        query: {
            username
        }
    });

    let userInfo;
    let classSocket = "";
    let curConversationId = "";
    let curClassId = "";
    let curClassName = "";
    let openedConversationId = "";

    socket.on('userInfo', data => {
        userInfo = data;
        if (!userInfo.isStudent) setStudent(false);
        if (userInfo.enrolledClassNames.length > 0) {
            $('#dropdownMenuButton').text(userInfo.enrolledClassNames[0]);
            for (let i=0; i<userInfo.enrolledClassNames.length; i++) {
                $('#dropdownMenu').append($('<a/>', {
                    class: "dropdown-item", 
                    click: event => {
                        if ($('#dropdownMenuButton').text() !== event.target.innerText) {
                            setConversationName(null);
                        }
                        $('#dropdownMenuButton').text(event.target.innerText);
                        curClassId = userInfo.enrolledClassIds[i];
                        curClassName = event.target.innerText;
                        joinClass("/" + userInfo.enrolledClassIds[i]);
                    }, 
                    text: userInfo.enrolledClassNames[i]
                }));
            }

            curClassId = userInfo.enrolledClassIds[0];
            curClassName = userInfo.enrolledClassNames[0];
            joinClass("/" + userInfo.enrolledClassIds[0]);
        } else {
            $('#dropdownMenuButton').text("");
            $('#dropdownMenu').append($('<a/>', {
                class: "dropdown-item", 
                text: "No classes found"
            }));
        }

        if (!userInfo.isStudent) {
            document.querySelector('#addClass').onclick = function() {
                setShowCreateClass(true);
                document.querySelector('#finishCreateClass').onclick = function() {
                    socket.emit('addClass', userInfo.username, $('#className').val());
                    setShowCreateClass(false);
                };
            }
        }

        socket.on('addClassResponse', (newClassId, newClassName) => {
            $('#dropdownMenuButton').text(newClassName);
            if (userInfo.enrolledClassNames.length === 0) {
                $('#dropdownMenu').html("");
            }
            $('#dropdownMenu').append($('<a/>', {
                class: "dropdown-item", 
                click: event => {
                    $('#dropdownMenuButton').text(event.target.innerText);
                    curClassId = newClassId;
                    curClassName = newClassName;
                    joinClass("/" + newClassId);
                }, 
                text: newClassName
            }));
            userInfo.enrolledClassIds.push(newClassId);
            userInfo.enrolledClassNames.push(newClassName);

            curClassId = newClassId;
            curClassName = newClassName;
            joinClass("/" + newClassId);
        });

        if (!userInfo.isStudent) {
            document.querySelector('#addStudent').onclick = function() {
                setShowAddStudents(true);
                document.querySelector('#finishAddStudents').onclick = function() {
                    socket.emit('addStudents', $('#studentEmails').val(), curClassId, curClassName);
                    setShowAddStudents(false);
                };
            }
        }
    });

    socket.on('classAddedStudent', (classId, className) => {
        if (userInfo.enrolledClassNames.length === 0) {
            $('#dropdownMenuButton').text(className);
        }
        if (userInfo.enrolledClassNames.length === 0) {
            $('#dropdownMenu').html("");
        }
        $('#dropdownMenu').append($('<a/>', {
            class: "dropdown-item", 
            click: event => {
                $('#dropdownMenuButton').text(className);
                curClassId = classId;
                curClassName = className;
                joinClass("/" + classId);
            }, 
            text: className
        }));
        userInfo.enrolledClassIds.push(classId);
        userInfo.enrolledClassNames.push(className);

        if (userInfo.enrolledClassNames.length === 1) {
            curClassId = classId;
            curClassName = className;
            joinClass("/" + classId);
        }
    });

    function joinClass(classId) {
        if (classSocket) {
            classSocket.close();
        }
        
        classSocket = io(`http://localhost:5000${classId}`, {
            query: {
                name: userInfo.name, 
                avatarUrl: userInfo.avatarUrl
            }
        });

        classSocket.on('startConversationList', startConversationList => {
            setConversation(startConversationList.enrolledClassName);
            setConversationIdList(startConversationList.conversationIds.reverse());
            setConversationNameList(startConversationList.conversationNames.reverse());

            setOpenConversationClicker(startConversationList.conversationIds);
        });
        
        classSocket.on('tellBranches', (conversationName, branchedConversationIds, branchedConversationNames) => {
            setConversation(conversationName);
            setConversationIdList(branchedConversationIds.reverse());
            setConversationNameList(branchedConversationNames.reverse());

            setOpenConversationClicker(branchedConversationIds);
        });

        classSocket.on('tellParent', (conversationId, conversationName, branchedConversationIds, branchedConversationNames) => {
            curConversationId = conversationId;
            setConversation(conversationName);
            setConversationIdList(branchedConversationIds.reverse());
            setConversationNameList(branchedConversationNames.reverse());

            setOpenConversationClicker(branchedConversationIds);
        });

        classSocket.on('addConversationResponse', (conversationId, newConversation) => {
            if (curConversationId === conversationId) {
                setConversationIdList(prevConversationIdList => [newConversation._id, ...prevConversationIdList]);
                setConversationNameList(prevConversationNameList => [newConversation.conversationName, ...prevConversationNameList]);

                document.querySelector("#a_" + newConversation._id).onclick = function() {
                    classSocket.emit('getBranches', newConversation._id);
                    curConversationId = newConversation._id;
                };

                document.querySelector("#div_" + newConversation._id).onclick = function() {
                    openedConversationId = newConversation._id;
                    joinConversation(newConversation._id);
                };
            }       
        });

        classSocket.on('addConversationResponseSender', (conversationId, newConversation) => {
            if (curConversationId !== conversationId) {
                classSocket.emit('getConversationBranches', conversationId);

                classSocket.removeListener('getConversationBranchesResponse');
                classSocket.on('getConversationBranchesResponse', conversationInfo => {
                    curConversationId = conversationId;
                    setConversation(conversationInfo.conversationName);
                    setConversationIdList(conversationInfo.branchedConversationIds.reverse());
                    setConversationNameList(conversationInfo.branchedConversationNames.reverse());

                    conversationInfo.branchedConversationIds.forEach(conversationId => {
                        document.querySelector("#a_" + conversationId).onclick = function() {
                            classSocket.emit('getBranches', conversationId);
                            curConversationId = conversationId;
                        };
        
                        document.querySelector("#div_" + conversationId).onclick = function() {
                            openedConversationId = conversationId;
                            joinConversation(conversationId);
                        };
                    });
                });
            }

            openedConversationId = newConversation._id;
            joinConversation(newConversation._id);
        })
    }

    function setOpenConversationClicker(conversationIdList) {
        conversationIdList.forEach((conversationId, index) => {
            document.querySelector("#a_" + conversationId).onclick = function() {
                classSocket.emit('getBranches', conversationId);
                curConversationId = conversationId;
            };
        });

        conversationIdList.forEach((conversationId, index) => {
            document.querySelector("#div_" + conversationId).onclick = function() {
                openedConversationId = conversationId;
                joinConversation(conversationId);
            };
        });

        if (curConversationId.length > 0) {
            document.querySelector("#backButton").onclick = function() {
                classSocket.emit('getParent', curConversationId);
            };
        }

        document.querySelector("#createConversationButton").onclick = function() {
            setShowAddConversations(true);
            document.querySelector("#finishCreateConversation").onclick = function() {
                classSocket.emit('addConversation', curClassId, curConversationId, $('#conversationName').val(), $('#conversationQuestionArea').val(), null);
                setShowAddConversations(false);
            }
        }
    }

    function joinConversation(conversationId) {
        classSocket.emit('joinConversation', conversationId);

        classSocket.removeListener('conversationInfo');
        classSocket.removeListener('messageToClients');

        classSocket.on('conversationInfo', (conversationInfo, messageInfo) => {
            setConversationName(conversationInfo.conversationName);
            setConversationQuestion(conversationInfo.conversationQuestion);
            setMessages(messageInfo.messages.map(message => getFullMsg(message)));
            setConversationBranchedMessageId(conversationInfo.branchedMessageId);

            messageInfo.messages.forEach(message => {
                document.querySelector("#conversationMessage" + message.id).ondblclick = function() {
                    setShowAddConversations(true);
                    document.querySelector("#finishCreateConversation").onclick = function() {
                        classSocket.emit('addConversation', curClassId, openedConversationId, $('#conversationName').val(), $('#conversationQuestionArea').val(), message.id);
                        setShowAddConversations(false);
                    }                    
                }
            });

            if (conversationInfo.branchedMessageId !== "null") {
                document.querySelector("#branchBtn").onclick = function() {
                    openedConversationId = conversationInfo.parentConversationId;
                    joinConversation(conversationInfo.parentConversationId);
                }
            }

        });

        function newMessage() {
            classSocket.emit('newMessage', $('#userMessage').val());
            $('#userMessage').val("");
        }

        document.querySelector('#newMessageForm').onsubmit = function(event) {
            event.preventDefault();
            if ($('#userMessage').val().length > 0) {
                newMessage();
            }
        };   
        
        document.querySelector('#userMessage').onkeypress = function(key) {
            if(key.which === 13 && $('#userMessage').val().length > 0) {
                newMessage();
            }
        };

        classSocket.on('messageToClients', msg => {
            setMessages(prevMessages => [...prevMessages, getFullMsg(msg)]);
            document.querySelector("#conversationMessage" + msg.id).ondblclick = function() {
                setShowAddConversations(true);
                document.querySelector("#finishCreateConversation").onclick = function() {
                    classSocket.emit('addConversation', curClassId, openedConversationId, $('#conversationName').val(), $('#conversationQuestionArea').val(), msg.id);
                    setShowAddConversations(false);
                }                    
            }
        });
    }

    function getFullMsg(msg) {
        return {
            ...msg, 
            avatar: (msg === "null" ? "https://via.placeholder.com/50" : msg.avatarUrl)
        }
    }
}

export default socketConnection;