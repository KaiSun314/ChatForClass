import React from 'react';
import Field from './Field';
import Button from "@material-ui/core/Button";
import {withRouter} from 'react-router-dom';
import $ from 'jquery';
import Header from './Header';
import axios from 'axios';

function Register(props) {
    function handleRegister(event) {
        event.preventDefault();
        if ($('#registerForm')[0].checkValidity()) {
            fetch('http://localhost:5000/signup', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: $('#nameFieldSignUp').val(),
                    isStudent: ($('input[name=isStudent]:checked', '#registerForm').val() === "student"),
                    username: $('#emailFieldSignUp').val(), 
                    password: $('#passwordFieldSignUp').val()
                }), 
                credentials: 'include'
            })
            .then(response => {
                response.json().then(data => {
                    if (data && data.hasOwnProperty('success') && data.success) {
                        const files = document.getElementById('avatarFieldSignUp').files;
                        if (files.length > 0) {
                            const file = files[0];

                            axios.get('http://localhost:5000/AWS_S3', {
                                params: {
                                    userId: data.userId
                                }
                            })
                            .then(uploadConfig => {
                                axios.put(uploadConfig.data, file, {
                                    headers: {
                                        'Content-Type': file.type
                                    }
                                })
                                .then(res => {
                                    axios.post('http://localhost:5000/setImageUrl', {
                                        avatarUrl: uploadConfig.data.split("?")[0], 
                                        username: data.username
                                    })
                                    .then(res => {
                                        if (res.data.success) window.location.href = "http://localhost:3000/chat";
                                    })
                                    .catch(err => {
                                        console.log(err);
                                    })
                                })
                                .catch(err => {
                                    console.log(err);
                                })
                            })
                            .catch(err => {
                                console.log(err);
                            });
                        } else {
                            console.log("No file specified");
                            window.location.href = "http://localhost:3000/chat";
                        }
                    }
                });
            });
        } else {
            $('#registerForm')[0].reportValidity()
        }
    }

    function handleGoToLogIn() {
        props.history.push({pathname: '/login'});
    }

    return (
        <div>
            <Header isChatMode={false} logInOut={[]} />
            <form className="loginContainer" id="registerForm" autoComplete="false">
                <Field type="text" id="nameFieldSignUp" className="fieldInput" placeholder="Name" minLength="0" pattern=".*" style={{}} required="true"/>
                <Field type="email" id="emailFieldSignUp" className="fieldInput" placeholder="Email Address" minLength="1" pattern=".+@.+" style={{}} required="true"/>
                <Field type="password" id="passwordFieldSignUp" className="fieldInput" placeholder="Password" minLength="8" pattern=".*" style={{}} required="true"/>
                <Field type="file" id="avatarFieldSignUp" className="form-control-file" placeholder="" minLength="0" pattern=".*" style={{width: "40%", textAlign: "right", backgroundColor: "rgba(252, 252, 252, 0.2)", border: "1px solid rgba(252, 252, 252, 0.4)", margin: "0 auto 10px auto"}} required="false" accept="image/*"/>
                <Field type="radio" style={{color: "#ffffff", fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji"}}/>
                <Button type="submit" onClick={handleRegister} variant="contained" className="loginButton" style={{backgroundColor: "#ffffff", color: "#007bff", fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji"}}>
                    Register
                </Button>
                <Button type="button" onClick={handleGoToLogIn} style={{display: "block", margin: "0 auto 10px auto", marginTop: "10px", backgroundColor: "#007bff", color: "#ffffff", fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji"}}>
                    Go to Log In
                </Button>
            </form>
        </div>
    );
}

export default withRouter(Register);