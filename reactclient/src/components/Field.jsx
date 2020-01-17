import React from 'react';

function Field(props) {
    if (props.type === "radio") {
        return (
            <div className="form-group">
                <div className="form-check form-check-inline" style={{paddingRight: "20px"}}>
                    <input className="form-check-input" type="radio" name="isStudent" id="studentFieldSignUp" value="student" style={{width: "15px", marginRight: "10px"}} defaultChecked />
                    <label className="form-check-label" htmlFor="studentFieldSignUp" style={props.style}>Student</label>
                </div>
                <div className="form-check form-check-inline">
                    <input className="form-check-input" type="radio" name="isStudent" id="teacherFieldSignUp" value="teacher" style={{width: "15px", marginRight: "10px"}} />
                    <label className="form-check-label" htmlFor="teacherFieldSignUp" style={props.style}>Teacher</label>
                </div>
            </div>
        );
    } else if (props.type === "file") {
        return (
            <div className="form-group">
                <input type={props.type} id={props.id} className={props.className} placeholder={props.placeholder} minLength={props.minLength} pattern={props.pattern} style={props.style} accept={props.accept} />
            </div>
        );
    } else if (props.required === "true") {
        return (
            <div className="form-group">
                <input type={props.type} id={props.id} className={props.className} placeholder={props.placeholder} minLength={props.minLength} pattern={props.pattern} style={props.style} required />
            </div>
        );
    } else {
        return (
            <div className="form-group">
                <input type={props.type} id={props.id} className={props.className} placeholder={props.placeholder} minLength={props.minLength} pattern={props.pattern} style={props.style} />
            </div>
        );
    }
}

export default Field;