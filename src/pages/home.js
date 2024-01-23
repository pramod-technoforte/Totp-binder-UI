import React, { useEffect } from 'react';
import '../styles/home.css';
import SignInWithEsignetButton from '../login-plugin';
import clientDetails from '../constants/clientDetails';
import Constants from '../constants/constant';

function Home() {
    
    useEffect(() => {

        localStorage.removeItem(Constants.ACCESS_TOKEN);

        // Define Configurations
        const oidcConfig = {
            authorizeUri: clientDetails.uibaseUrl + clientDetails.authorizeEndpoint,
            redirect_uri: clientDetails.redirect_uri,
            client_id: clientDetails.clientId,
            scope: clientDetails.scope,
            nonce: clientDetails.nonce,
            state: clientDetails.state,
            response_type: clientDetails.response_type,
            acr_values: clientDetails.acr_values,
            display: clientDetails.display,
            prompt: clientDetails.prompt,
            max_age: clientDetails.max_age,
            claims_locales: clientDetails.claims_locales,
            claims: JSON.parse(decodeURI(clientDetails.userProfileClaims)),
        };

        // Define your button configuration
        const buttonConfig = {
            shape: "soft_edges",
            labelText: ("sign in with esignet"),
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

        console.log(oidcConfig);

    }, []);

    return (

        <div className='container'>
            <h1 className='heading'>{Constants.HOME_PAGE_TITLE}</h1>

            <div id='sign-in-with-esignet'></div>
        </div>
    );
}

export default Home;