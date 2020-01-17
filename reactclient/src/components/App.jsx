import React, {useState, useEffect} from 'react';
import {
    Route, 
    Redirect,
    Switch, 
    withRouter
} from 'react-router-dom';
import Conversation from './Conversation';
import Login from './Login';
import Register from './Register';
import HomePage from './HomePage';
import PageNotFound from './PageNotFound';

function App(props) {
    const [isAuthenticated, setAuthenticated] = useState(false);
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        if (props.location.pathname === '/' || props.location.pathname === '/chat') {
            fetch('http://localhost:5000/isAuthenticated', {
                credentials: 'include'
            })
            .then(response => {
                response.json().then(data => {
                    if (data && data.hasOwnProperty('isAuthenticated') && data.isAuthenticated !== isAuthenticated) {
                        setAuthenticated(data.isAuthenticated);
                    }
                    setLoading(false);
                });
            });
        }
    });

    return (
        <Switch>
            <Route exact path='/' render={(props) => (!isLoading && (isAuthenticated ? <Redirect to='/chat' /> : <HomePage />))}/>
            <Route path='/login' render={(props) => <Login />}/>
            <Route path='/signup' render={(props) => <Register /> }/>
            <Route path='/chat' render={(props) => (!isLoading && (isAuthenticated ? <Conversation /> : <Redirect to='/login' />))}/>
            <Route component={PageNotFound} />
        </Switch>
    );
}

export default withRouter(App);
