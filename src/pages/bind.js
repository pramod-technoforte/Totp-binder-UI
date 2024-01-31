import React, { useState, useEffect } from "react";
import QRCode from "react-qr-code";
import { encode } from "hi-base32";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
	post_fetchAccessToken,
	post_confirmTokenBind,
} from "../services/AuthService";
import Constants from "../constants/Constant";
import FormAction from "../components/FormAction";
import ClientDetails from "../config/ClientDetails";

const Bind = () => {
	const [accessToken, setAccessToken] = useState(null);
	const [otpAuthUrl, setOtpAuthUrl] = useState("");
	const [base32EncodedKey, setBase32EncodedKey] = useState("");
	const [qrCodeVisible, setQRCodeVisible] = useState(false);
	const [tokenBindConfirmed, setTokenBindConfirmed] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [successMessage, setSuccessMessage] = useState("");

	const [searchParams] = useSearchParams();
	const authCode = searchParams.get("code");

	const disabled = false;

	const navigate = useNavigate();

	useEffect(() => {
		const storedToken = localStorage.getItem(Constants.ACCESS_TOKEN);

		if (storedToken) {
		setAccessToken(storedToken);
		console.log("Access Token (Local Storage) : " + storedToken);
		console.log("Time : " + new Date().toLocaleTimeString());
		} else {
		setLoading(true);
		post_fetchAccessToken(authCode)
			.then((token) => {
			setAccessToken(token);
			console.log("Access Token (API) : " + token);
			console.log("Time : " + new Date().toLocaleTimeString());
			localStorage.setItem(Constants.ACCESS_TOKEN, token);
			})
			.catch((error) => {
			console.error("Error fetching user details:", error);
			setError("Error fetching access token.");
			})
			.finally(() => {
			setLoading(false);
			});
		}
	}, []);

	const generateSymmetricKey = () => {
		const secretKey = new Uint8Array(30);
		window.crypto.getRandomValues(secretKey);

		const base32EncodedKey = encode(secretKey);
		const otpAuthUrl = `otpauth://totp/${Constants.SECRET_KEY_URI_LABEL}?secret=${base32EncodedKey}&issuer=${Constants.SECRET_KEY_URI_ISSUER}&digits=${ClientDetails.digitsInTotp}&period=${ClientDetails.periodOfTotp}&algorithm=${ClientDetails.algorithmOfTotp}`;

		console.log("Secret Key: " + base32EncodedKey);
		console.log("QR URI: " + otpAuthUrl);
		setBase32EncodedKey(base32EncodedKey);
		setOtpAuthUrl(otpAuthUrl);
		setQRCodeVisible(true);
		setTokenBindConfirmed(false);
	};

	const confirmTokenBind = async () => {
		setLoading(true);
		try {
		const response = await post_confirmTokenBind(
			accessToken,
			base32EncodedKey
		);

		if (response === Constants.SUCCESS_MSG) {
			setTokenBindConfirmed(true);
			setSuccessMessage(Constants.BIND_SUCCESS_MSG);
		} else {
			setSuccessMessage(Constants.BIND_FAIL_MSG);
		}
		setQRCodeVisible(false);
		} catch (error) {
		console.error("Error confirming token bind:", error);
		} finally {
		setLoading(false);
		}
	};

	const handleLogout = () => {
		localStorage.removeItem(Constants.ACCESS_TOKEN);
		navigate("/");
	};

	return (
    <>
	<div className="lg:flex-grow lg:px-24 md:px-16 flex flex-col">
		{loading && <p>Loading...</p>}
		{error && <p>Error: {error}</p>}
		{!loading && !error && (
				<div className="grid w-full flex shadow-lg rounded bg-[#FFFFFF] relative">
				<div className="flex justify-center w-full mt-5">
					<div className="row-span-5 w-96 self-start">
					<div className="px-11 py-2">
						{successMessage ? (
						<div
							className={`mt-5 text-center ${
							successMessage.includes(Constants.BIND_SUCCESS_MSG)
								? "bg-green-200 text-green-800 border border-green-400 p-2 rounded"
								: "bg-red-200 text-red-800 border border-red-400 p-2 rounded"
							}`}
						>
							{successMessage}
						</div>
						) : (
						<FormAction
							id="General"
							disabled={tokenBindConfirmed}
							type={Constants.BUTTON}
							text={qrCodeVisible ? Constants.REGENERATE_KEY_BTN : Constants.GENERATE_KEY_BTN}
							handleClick={generateSymmetricKey}
						/>
						)}
					</div>
					</div>
				</div>
				{qrCodeVisible && (
					<>
					<div className="flex justify-center mt-2">
						<div className="row-span-5 self-start">
						<div className="border border-1 border-#00000059 rounded-lg p-2">
							<QRCode className="h-50" value={otpAuthUrl} />
						</div>
						</div>
					</div>
					
					<div className="flex justify-center mt-1">
						<p className="text-sm text-gray-500">{Constants.QR_CODE_LABEL}</p>
					</div>
					
					<div className="flex justify-center w-full mt-4">
						<div className="row-span-5 w-96 self-start">
						<div className="px-11 py-2">
							{tokenBindConfirmed ? null : (
							<FormAction
								id="Register"
								disabled={tokenBindConfirmed}
								type={Constants.BUTTON}
								text={Constants.CONFIRM_BIND_BTN}
								handleClick={confirmTokenBind}
							/>
							)}
						</div>
						</div>
					</div>
					</>
				)}
				<div className="flex justify-center w-full mb-5">
					<div className="row-span-5 w-96 self-start">
					<div className="px-11 py-2">
						<FormAction
						id="Logout"
						disabled={disabled}
						type={Constants.BUTTON}
						text={Constants.LOGOUT_BTN}
						handleClick={handleLogout}
						/>
					</div>
					</div>
				</div>
				</div>
		)}
	</div>
	</>
	);
};

export default Bind;
