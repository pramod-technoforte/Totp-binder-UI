import React, { useEffect } from 'react';
import '../styles/home.css';
// import { SignInWithEsignet } from 'sign-in-with-esignet';
import clientDetails from '../clientDetails';

function Home() {
    
    useEffect(() => {

        const oidcConfig = {
            authorizeUri: clientDetails.uibaseUrl + clientDetails.authorizeEndpoint,
            redirect_uri: clientDetails.redirect_uri,
            client_id: clientDetails.clientId,
            scope: clientDetails.scope
        };

        window.SignInWithEsignetButton?.init({
            oidcConfig: oidcConfig,
            buttonConfig: {
                shape: "soft_edges",
                labelText: ("sign_in_with"),
                width: "100%"
            },
            signInElement: document.getElementById("sign-in-with-esignet"),
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