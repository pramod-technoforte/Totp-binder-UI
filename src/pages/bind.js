import React, {useState, useEffect} from "react";
import QRCode from 'react-qr-code';
import { encode } from 'hi-base32';
import { useSearchParams, useNavigate } from "react-router-dom";
import '../styles/bind.css';
import { post_fetchAccessToken, post_confirmTokenBind } from '../services/authService';
import Constants from '../constants/constant';
import FormAction from "../components/FormAction";

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
        const secretKey = generateRandomSecretKey();
        const base32EncodedKey = encode(secretKey);
        const otpAuthUrl = `otpauth://totp/YourAppName?secret=${base32EncodedKey}&issuer=TOTPBindingService`;

        console.log("Secret Key: " + base32EncodedKey);
        setBase32EncodedKey(base32EncodedKey);
        setOtpAuthUrl(otpAuthUrl);
        setQRCodeVisible(true);
        setTokenBindConfirmed(false);
    };

    const generateRandomSecretKey = () => {
        const validCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let secretKey = '';

        for (let i = 0; i < 30; i++) {
            const randomIndex = Math.floor(Math.random() * validCharacters.length);
            secretKey += validCharacters.charAt(randomIndex);
        }

        return secretKey;
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
                    <form className="mt-2 space-y-2">
                        <FormAction
                            disabled={tokenBindConfirmed}
                            type={Constants.BUTTON}
                            text={Constants.GENERATE_KEY_BTN}
                            handleClick={generateSymmetricKey}
                            />
                        
                        {qrCodeVisible && (
                            <div>
                                <div className="border border-4 border-sky-600 rounded-3xl p-4 mb-3">
                                <QRCode value={otpAuthUrl}/>
                                </div>
                                <br></br>
                                    <div className="mb-3">
                                        <FormAction
                                            disabled={tokenBindConfirmed}
                                            type={Constants.BUTTON}
                                            text={Constants.CONFIRM_BIND_BTN}
                                            handleClick={confirmTokenBind}
                                        />
                                    </div>
                            </div>
                        )}

                        <div className="mt-5">
                            <FormAction
                                    disabled={disabled}
                                    type={Constants.BUTTON}
                                    text={Constants.LOGOUT_BTN}
                                    handleClick={handleLogout}
                            />
                        </div>
                    </form>
                    </div>
                )}
                

                {successMessage && <p>{successMessage}</p>}
        </div>
    );
};

export default Bind;