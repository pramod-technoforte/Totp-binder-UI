import React, { useEffect } from "react";
import SignInWithEsignetButton from "../login-plugin";
import ClientDetails from "../config/ClientDetails";
import Constants from "../constants/Constant";
import Header from "../components/Header";
import ImageDisplay from "../components/ImageDisplay";

function Home() {
	useEffect(() => {
		localStorage.removeItem(Constants.ACCESS_TOKEN);

		// Define Configurations
		const oidcConfig = {
		authorizeUri: ClientDetails.uibaseUrl + ClientDetails.authorizeEndpoint,
		redirect_uri: ClientDetails.redirect_uri,
		client_id: ClientDetails.clientId,
		scope: ClientDetails.scope,
		nonce: ClientDetails.nonce,
		state: ClientDetails.state,
		response_type: ClientDetails.response_type,
		acr_values: ClientDetails.acr_values,
		display: ClientDetails.display,
		prompt: ClientDetails.prompt,
		max_age: ClientDetails.max_age,
		claims_locales: ClientDetails.claims_locales,
		claims: JSON.parse(decodeURI(ClientDetails.userProfileClaims)),
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
	}, []);

	return (
    <>
		<Header	pageTitle={Constants.PAGE_TITLE}/>

		<section className="text-gray-600 mt-4 body-font ">
			<div className="container flex mx-auto px-5 md:flex-row flex-col ">
				
				<ImageDisplay imageUrl={"images/background_img.png"}/>

				<div className="lg:flex-grow lg:px-24 md:px-16 flex flex-col">
					<div className="grid grid-rows-5 w-full flex shadow-lg rounded bg-[#FFFFFF] relative">
						<div className="w-full mt-10 ">
							<h1 className="flex justify-center title-font sm:text-2xl text-2xl mb-3 font-medium">
								{Constants.LOGIN_TITLE}
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
};

export default Home;
