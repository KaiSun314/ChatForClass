import React, { useState, useEffect } from 'react';
import Header from './Header';
import Body from './Body';
import socketConnection from '../socketConnectionClient';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function Conversation() {
    const [socketConnectionMade, setSocketConnectionMade] = useState(false)
    const [conversation, setConversation] = useState(null);
    const [conversationNameList, setConversationNameList] = useState([]);
    const [conversationIdList, setConversationIdList] = useState([]);
    const [conversationName, setConversationName] = useState(null);
    const [conversationQuestion, setConversationQuestion] = useState(null);
    const [conversationBranchedMessageId, setConversationBranchedMessageId] = useState("null");
    const [messages, setMessages] = useState([]);
    const [isStudent, setStudent] = useState(true);
    const [showCreateClass, setShowCreateClass] = useState(false);
    const [showAddStudents, setShowAddStudents] = useState(false);
    const [showAddConversations, setShowAddConversations] = useState(false);
    
    const handleCloseAddConversations = () => setShowAddConversations(false);

    useEffect(() => {
        if (!socketConnectionMade) {
            setSocketConnectionMade(true);
            fetch('http://localhost:5000/info', {
                credentials: 'include'
            })
            .then(response => {
                response.json().then(username => {
                    socketConnection(username, setConversation, setConversationNameList, setConversationIdList, setConversationName, setMessages, setStudent, setShowCreateClass, setShowAddStudents, setShowAddConversations, setConversationQuestion, setConversationBranchedMessageId);
                });
            });
        }
    });

    return (
        <div>
            <Header isChatMode={true} logInOut={["Log Out"]} isStudent={isStudent} showCreateClass={showCreateClass} setShowCreateClass={setShowCreateClass} showAddStudents={showAddStudents} setShowAddStudents={setShowAddStudents}/>
            <Body 
                conversation={conversation} 
                conversationNameList={conversationNameList} 
                conversationIdList={conversationIdList} 
                conversationName={conversationName} 
                conversationQuestion={conversationQuestion}
                conversationBranchedMessageId={conversationBranchedMessageId}
                messages={messages} 
            />
            <Modal show={showAddConversations} onHide={handleCloseAddConversations}>
                <Modal.Header closeButton>
                    <Modal.Title>Create a new conversation</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h5 style={{display: "inline-block", marginBottom: "10px"}}>Title: </h5>
                    <input type="text" id="conversationName" style={{display: "inline-block"}} autoComplete="off"/>
                    <h5 style={{display: "inline-block", marginBottom: "10px", marginTop: "20px"}}>Question: </h5>
                    <textarea className="form-control" id="conversationQuestionArea" rows="8" style={{borderColor: 'black'}}></textarea>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseAddConversations}>
                        Close
                    </Button>
                    <Button variant="primary" id="finishCreateConversation">
                        Create conversation
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default Conversation;