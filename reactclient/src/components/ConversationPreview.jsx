import React from 'react';
import LaunchIcon from '@material-ui/icons/Launch';
import Button from '@material-ui/core/Button';

function ConversationPreview(props) {
    return (
        <div>
            <a className="nav-link" id={"a_"+props.id} style={{display: "inline-block", width: "100%"}}>{props.conversation}</a>
            <div className="launch">
                <Button id={"div_"+props.id}>
                    <LaunchIcon />
                </Button>                
            </div>
        </div>
    );
}

export default ConversationPreview;