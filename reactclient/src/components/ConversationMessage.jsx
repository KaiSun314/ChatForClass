import React from 'react';

function ConversationMessage(props) {
    return (
        <li key={props.id} id={"conversationMessage" + props.id} style={{paddingLeft: "0px"}}>
            <div className="user-image">
                <img src={props.avatar} style={{height: "50px", width: "50px", borderRadius: "5px"}}/>
            </div>
            <div className="user-message" style={{width: "100%"}}>
                <div className="user-name-time"><span style={{fontWeight: "bold", color: "#000000"}}>{props.name}</span> <span style={{paddingLeft: "10px"}}>{props.creationTime}</span></div>
                <div className="message-text">{props.message}</div>
            </div>
        </li>
    );
}

export default ConversationMessage;