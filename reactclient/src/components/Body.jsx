import React from 'react';
import ConversationSidebar from './ConversationSidebar';
import ConversationMain from './ConversationMain';

function Body(props) {
    return (
        <div className="container-fluid" style={{backgroundColor: "#FFFFFF"}}>
            <div className="row">
                <div className="col-md-4 col-xl-3 side-bar">
                    <ConversationSidebar conversation={props.conversation} conversationNameList={props.conversationNameList} conversationIdList={props.conversationIdList} />
                </div>
                <div className="col-md-8 col-xl-9" style={{paddingLeft: "0px", paddingRight: "0px"}}>
                    <ConversationMain conversationName={props.conversationName} conversationQuestion={props.conversationQuestion} conversationBranchedMessageId={props.conversationBranchedMessageId} messages={props.messages} />
                </div>
            </div>
        </div>
    )
}

export default Body;