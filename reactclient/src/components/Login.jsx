import React from 'react';
import Field from './Field';
import Button from "@material-ui/core/Button";
import {withRouter} from 'react-router-dom';
import $ from 'jquery';
import Header from './Header';

function Login(props) {
    function handleLogin(event) {
        event.preventDefault();
        if ($('#loginForm')[0].checkValidity()) {
            fetch('http://localhost:5000/login', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: $('#emailFieldLogIn').val(), 
                    password: $('#passwordFieldLogIn').val()
                }), 
                credentials: 'include'
            })
            .then(response => {
                response.json().then(data => {
                    if (data && data.hasOwnProperty('success') && data.success) {
                        window.location.href = "http://localhost:3000/chat";
                    }
                });
            });
        } else {
            $('#loginForm')[0].reportValidity()
        }
    }

    function handleGoToSignUp() {
        props.history.push({pathname: '/signup'});
    }

    return (
        <div>
            <Header isChatMode={false} logInOut={[]} />
            <form className="loginContainer" id="loginForm" autoComplete="false">
                <Field type="email" id="emailFieldLogIn" className="fieldInput" placeholder="Email Address" minLength="0" pattern=".*" style={{}} required="true"/>
                <Field type="password" id="passwordFieldLogIn" className="fieldInput" placeholder="Password" minLength="0" pattern=".*" style={{}} required="true"/>
                <Button type="submit" onClick={handleLogin} variant="contained" className="loginButton" style={{backgroundColor: "#ffffff", color: "#007bff", fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji"}}>
                    Log In
                </Button>
                <Button onClick={handleGoToSignUp} style={{display: "block", margin: "0 auto 10px auto", marginTop: "10px", backgroundColor: "#007bff", color: "#ffffff", fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji"}}>
                    Go to Sign Up
                </Button>
            </form>
        </div>
    );
}

export default withRouter(Login);