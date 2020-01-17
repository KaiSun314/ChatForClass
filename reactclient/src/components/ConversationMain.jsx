import React, {useState, useEffect} from 'react';
import ConversationMessage from './ConversationMessage';
import SendIcon from '@material-ui/icons/Send';
import Button from '@material-ui/core/Button';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';

function ConversationMain(props) {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        if (props.conversationBranchedMessageId === "null" && !scrolled) {
            const messages = document.querySelector("#messages");
            messages.scrollTo(0, messages.scrollHeight);
        } else {
            if (document.querySelector("#conversationMessage" + props.conversationBranchedMessageId)) {
                setScrolled(true);
                document.querySelector("#conversationMessage" + props.conversationBranchedMessageId).scrollIntoView({
                    block: "center"
                });
            }
        }
    });

    return (
        <div className="conversationMain" style={{visibility: (props.conversationName ? "visible" : "hidden")}}>
            <div className="room-header">
                <div className="flex-container">
                    <button type="button" className="btn" id="expandableBtn" data-toggle="collapse" data-target="#conversationQuestion" style={{display: "inline-block"}}>
                        <h3 className="conversationText">{props.conversationName}</h3>
                    </button>
                    {props.conversationBranchedMessageId !== "null" && (
                        <Button type="button" className="btn" id="branchBtn">
                            <ArrowUpwardIcon />
                        </Button>
                    )}
                </div>
                <div id="conversationQuestion" className="collapse in">
                    <h5 className="conversationText">{props.conversationQuestion}</h5>
                </div>
            </div> 
            <div className="conversationMainBody" id="messages"> 
                <ul className="col-sm-12" id="chat">
                    {
                        props.messages.map(message => {
                            return (
                                <ConversationMessage 
                                    id={message.id}
                                    name={message.name}
                                    creationTime={new Date(message.creationTime).toLocaleString()}
                                    message={message.message}
                                    avatar={message.avatar}
                                />
                            );
                        })
                    }
                </ul>
            </div>
            <div className="message-form">
                <form className="form-inline" id="newMessageForm" autoComplete="off">
                    <div className="left">
                        <input id="userMessage" type="text" placeholder="Enter your message" />
                    </div>
                    <div className="right">
                        <button type="submit" id="sendButton" className="btn" style={{marginRight: "0"}}>
                            <SendIcon style={{color: "#007bff", fontSize: "30"}}/>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ConversationMain;