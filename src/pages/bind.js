import React, {useState, useEffect} from "react";
import QRCode from 'react-qr-code';
import { encode } from 'hi-base32';
import { useSearchParams, useNavigate } from "react-router-dom";
import '../styles/bind.css';
import { post_fetchAccessToken, post_confirmTokenBind } from '../services/authService';
import Constants from '../constants/constant';
import FormAction from "../components/FormAction";
import clientDetails from "../config/clientDetails";

const Bind = () => {
    const [accessToken, setAccessToken] = useState(null);
    const [otpAuthUrl, setOtpAuthUrl] = useState('');
    const [base32EncodedKey, setBase32EncodedKey] = useState('');
    const [qrCodeVisible, setQRCodeVisible] = useState(false);
    const [tokenBindConfirmed, setTokenBindConfirmed] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

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
        }
        else {
            setLoading(true);
            post_fetchAccessToken(authCode)
            .then(token => {
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
        const otpAuthUrl = `otpauth://totp/${Constants.SECRET_KEY_URI_LABEL}?secret=${base32EncodedKey}&issuer=${Constants.SECRET_KEY_URI_ISSUER}&digits=${clientDetails.digitsInTotp}&period=${clientDetails.periodOfTotp}`;

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
            const response = await post_confirmTokenBind(accessToken, base32EncodedKey);

            if (response === Constants.SUCCESS_MSG) {
                setSuccessMessage(Constants.BIND_SUCCESS_MSG);
                setTokenBindConfirmed(true);
            }
            else {
                setSuccessMessage(Constants.BIND_FAIL_MSG);
            }
            
        } catch (error) {
            console.error("Error confirming token bind:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem(Constants.ACCESS_TOKEN);
        navigate('/');
    };


    return (
        <div className="container">
            <div className="container">
                <h1 className="heading text-sky-600" title={"QR Code Generator"}>
                    {Constants.BIND_PAGE_TITLE}
                </h1>
            </div>    
            
                {loading && <p>Loading...</p>}
                
                {error && <p>Error: {error}</p>}
                
                {!loading && !error && (
                    <div className="container">
                    <form className="space-y-2">
                        <FormAction
                            id="General"
                            disabled={tokenBindConfirmed}
                            type={Constants.BUTTON}
                            text={Constants.GENERATE_KEY_BTN}
                            handleClick={generateSymmetricKey}
                            />
                        
                        {qrCodeVisible && (
                            <div>
                                <div className="border border-4 border-sky-600 rounded-3xl p-4">
                                <QRCode value={otpAuthUrl}/>
                                </div>
                                <br></br>
                                    <div className="">
                                        <FormAction
                                            id="General"
                                            disabled={tokenBindConfirmed}
                                            type={Constants.BUTTON}
                                            text={Constants.CONFIRM_BIND_BTN}
                                            handleClick={confirmTokenBind}
                                        />
                                    </div>
                            </div>
                        )}

                        <div>
                            <FormAction
                                id="Logout"
                                disabled={disabled}
                                type={Constants.BUTTON}
                                text={Constants.LOGOUT_BTN}
                                handleClick={handleLogout}
                            />
                        </div>
                    </form>
                    </div>
                )}
                

                {successMessage && (
                    <div className={`mt-5 ${successMessage.includes(Constants.BIND_SUCCESS_MSG) ? 'bg-green-200 text-green-800 border border-green-400 p-2 rounded' : 'bg-red-200 text-red-800 border border-red-400 p-2 rounded'}`}>
                    {successMessage}
                    </div>
                )}
        </div>
    );
};

export default Bind;