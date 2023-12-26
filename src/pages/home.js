import React, { useEffect } from 'react';
import '../styles/home.css';
import SignInWithEsignetButton from '../login-plugin';
import clientDetails from '../clientDetails';

function Home() {
    
    useEffect(() => {

        // Define Configurations
        const oidcConfig = {
            authorizeUri: clientDetails.uibaseUrl + clientDetails.authorizeEndpoint,
            redirect_uri: clientDetails.redirect_uri,
            client_id: clientDetails.clientId,
            scope: clientDetails.scope
        };

        // Define your button configuration
        const buttonConfig = {
            shape: "soft_edges",
            labelText: ("sign_in_with"),
            width: "100%"
        };  

        // Get the container element where you want to render the button
        const signInContainer = document.getElementById('sign-in-with-esignet');

        // Initialize the SignInWithEsignetButton component
        SignInWithEsignetButton.init({
            oidcConfig,
            buttonConfig,
            signInElement: signInContainer,
        });

    }, []);

    return (

        <div className='container'>
            <h1 className='heading'>TOTP Binder Service</h1>

            <div id='sign-in-with-esignet'></div>
        </div>
    );
}

export default Home;