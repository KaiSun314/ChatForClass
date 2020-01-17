import React from 'react';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ConversationPreview from './ConversationPreview';

function ConversationSidebar(props) {
    return (
        <nav className="d-none d-md-block bg-light" style={{paddingTop: "10px"}}>
            <div className="sidebar-sticky">
                <div className="parentConversation">
                    <h3 id="curConversation">
                        <button id="backButton" className="btn">
                            <div className="middle">
                                <ArrowBackIosIcon style={{marginBottom: "4px"}}/>
                            </div>
                        </button>
                        {props.conversation}
                    </h3>
                </div>
                <ul className="nav flex-column" style={{marginLeft: "10px"}}>
                    {
                        props.conversationNameList.map((conversation, index) => {
                            return (
                                <li key={props.conversationIdList[index]} className="nav-item">
                                    <ConversationPreview id={props.conversationIdList[index]} conversation={conversation}/>
                                </li>
                            );
                        })
                    }
                </ul>
                {(props.conversation && props.conversation !== "" && (<button type="button" className="btn addConversationButton" id="createConversationButton" style={{marginTop: "10px"}}>Create Conversation</button>))}
            </div>          
        </nav>
    )
}

export default ConversationSidebar;