import React from 'react';
import Header from './Header'

function HomePage(props) {
    return (
        <div>
            <Header isChatMode={false} logInOut={["Sign Up", "Log In"]}/>
            <div className="homePageDescription">
                <h3 className="descriptions">A chat application for students and teachers that allows branching of conversations</h3>
            </div>
        </div>
    );
}

export default HomePage;