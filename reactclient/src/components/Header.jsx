import React from 'react';
import {
    Link, 
    withRouter
} from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function Header(props) {
    const handleCloseCreateClass = () => props.setShowCreateClass(false);

    const handleCloseAddStudents = () => props.setShowAddStudents(false);

    function handleClick(event) {
        if (event.target.innerText === "Sign Up") {
            window.location.href = "http://localhost:3000/signup";
        } else if (event.target.innerText === "Log In") {
            window.location.href = "http://localhost:3000/login";
        } else if (event.target.innerText === "Log Out") {
            fetch('http://localhost:5000/logout', {
                credentials: 'include'
            })
            .then(response => {
                window.location.href = "http://localhost:3000";
            });
        }
    }
    
    return (
        <header>
            <div className="container-fluid" style={{paddingRight: "0px"}}>
                <div className="row headerRow" style={{paddingRight: "0px"}}>
                    <div className="col-md-4 col-xl-3" style={{paddingLeft: "0px", paddingRight: "0px"}}>
                        <nav className="navbar navbar-dark bg-primary" style={{paddingRight: "0"}}>
                            <Link 
                                className="navbar-brand d-flex justify-content-start"
                                to={{pathname: '/'}}
                            >
                                Chat for Class
                            </Link>
                            {props.isChatMode && <div className="navbar-brand dropdown d-flex justify-content-end" style={{marginRight: "6px"}}>
                                <button className="btn btn-sm btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style={{float: "right"}}>
                                    
                                </button>
                                <div className="dropdown-menu dropdown-menu-right" id="dropdownMenu" aria-labelledby="dropdownMenuButton">

                                </div>
                            </div>}
                        </nav>
                    </div>
                    {(props.isChatMode && !props.isStudent) && 
                        <div className="col-md-5 col-xl-5 d-flex justify-content-center">
                            <button className="btn addButton" id="addClass" style={{marginRight: "10px"}}>
                                Add Class
                            </button>
                            <button className="btn addButton" id="addStudent">
                                Add Student
                            </button>
                        </div>
                    }
                    <div className={(!props.isChatMode || props.isStudent) ? "col-md-8 col-xl-9 d-flex justify-content-end" : "col-md-3 col-xl-4 d-flex justify-content-end"} style={{paddingRight: "0px"}}>
                        {
                            props.logInOut.map((logInfo, index) => {
                                return (
                                    <nav key={index} className="navbar navbar-dark bg-primary" style={{paddingRight: "0"}}>
                                        <a
                                            className="navbar-brand" 
                                            style={{marginRight: "0px", marginLeft: "10px"}}
                                            onClick={handleClick}
                                        >
                                            {logInfo}
                                        </a>
                                    </nav>
                                );
                            })
                        }
                    </div>
                </div>
            </div>

            <Modal show={props.showCreateClass} onHide={handleCloseCreateClass}>
                <Modal.Header closeButton>
                    <Modal.Title>Create a new class</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h5 style={{display: "inline-block", marginBottom: "10px"}}>Class name: </h5>
                    <input type="text" id="className" style={{display: "inline-block"}} autoComplete="off"/>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseCreateClass}>
                        Close
                    </Button>
                    <Button variant="primary" id="finishCreateClass">
                        Create class
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={props.showAddStudents} onHide={handleCloseAddStudents}>
                <Modal.Header closeButton>
                    <Modal.Title>Add students to class</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h5 style={{display: "inline-block", marginBottom: "10px"}}>Student emails: </h5>
                    <textarea class="form-control" id="studentEmails" rows="5"></textarea>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseAddStudents}>
                        Close
                    </Button>
                    <Button variant="primary" id="finishAddStudents">
                        Add students
                    </Button>
                </Modal.Footer>
            </Modal>
        </header>
    );
}

export default withRouter(Header);