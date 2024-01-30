import React, { useEffect } from "react";
import SignInWithEsignetButton from "../login-plugin";
import clientDetails from "../config/clientDetails";
import Constants from "../constants/constant";

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
      labelText: "sign in with esignet",
      width: "100%",
    };

    // Get the container element where you want to render the button
    const signInContainer = document.getElementById("sign-in-with-esignet");

    // Initialize the SignInWithEsignetButton component
    SignInWithEsignetButton.init({
      oidcConfig,
      buttonConfig,
      signInElement: signInContainer,
    });

    console.log(oidcConfig);
  }, []);

  return (
    <>
      <section className="text-gray-600 mt-4 body-font ">
        <div className="container flex mx-auto px-5 md:flex-row flex-col ">
          <div className="flex justify-center mt-20 mb:mt-0 lg:w-1/2 md:w-1/2 w-5/6 mb-10 md:mb-0">
            <div>
              <img
                className="object-contain fixed"
                src="images/background_img.png"
                style={{ zIndex: -1, left: 200, bottom: 30 }}
              />
            </div>
          </div>
          <div className="lg:flex-grow lg:px-24 md:px-16 flex flex-col">
            <div className="grid grid-rows-5 mt-20 w-full flex shadow-lg rounded bg-[#FFFFFF] relative">
              <div className="w-full mt-10 ">
                <h1 className="flex justify-center title-font sm:text-2xl text-2xl mb-3 font-medium #707070">
                  TOTP Binder Service
                </h1>
              </div>
              <div className="flex justify-center w-full">
                <div className="row-span-5 w-96 self-start">
                  <div className="px-11 py-2">
                    <div id="sign-in-with-esignet"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;
