import React from 'react';
import '../styles/home.css';
import config from '../config';

function Home() {
    const handleLogin = () => {
        window.location.href = config.redirectUrls.login;
    };
    
    return (

        <div className='container'>
            <h1 className='heading'>TOTP Binder Service</h1>

            <div className='login-container'>
                <button onClick={handleLogin} className="login-button">
                    Login with e-Signet
                </button>
            </div>
        </div>
      );
}

export default Home;