import React from 'react';
import Header from './Header';

function PageNotFound() {
    return (
        <div>
            <Header isChatMode={false} logInOut={["Sign Up", "Log In"]}/>
            <div className="homePageDescription">
                <h3 className="descriptions">Oops 404, Page Not Found.</h3>
            </div>
        </div>
    );
}

export default PageNotFound;