import React, {useState, useEffect} from "react";
import QRCode from 'react-qr-code';
import { encode } from 'hi-base32';
import { useSearchParams, useNavigate } from "react-router-dom";
import '../styles/generateQR.css';

const QRCodePage = () => {
    const [accessToken, setAccessToken] = useState(null);
    const [otpAuthUrl, setOtpAuthUrl] = useState('');
    const [base32EncodedKey, setBase32EncodedKey] = useState('');
    const [qrCodeVisible, setQRCodeVisible] = useState(false);
    const [tokenBindConfirmed, setTokenBindConfirmed] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [searchParams] = useSearchParams();
    const authCode = searchParams.get("code");

    const navigate = useNavigate();

    useEffect(() => {
        const storedToken = localStorage.getItem('accessToken');

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
                localStorage.setItem('accessToken', token);
            })
            .catch((error) => {
                console.error("Error fetching user details:", error);
                setError("Error fetching access token.");
            })
            .finally(() => {
                setLoading(false);
            });
        }
    }, [authCode]);

    const post_fetchAccessToken = async (authCode) => {
        const apiUrl = 'http://localhost:8080/oauth/token';

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    code: authCode,
                }),
            });
        
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
        
            const data = await response.json();
            const token = data.accessToken;
        
            return token;
        } catch (error) {
            console.error("Error fetching access token:", error);
            throw error;
        }
    };

    const post_confirmTokenBind = async () => {
        const apiUrl = 'http://localhost:8080/binding/totp-key-bind';

        try {    
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({
                    totpKey: {
                        key: base32EncodedKey
                    }
                }),
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            
        } catch (error) {
            console.error("Error confirming token bind:", error);
        }
    };

    const generateSymmetricKey = () => {
        const secretKey = generateRandomSecretKey();
        const base32EncodedKey = encode(secretKey);
        const otpAuthUrl = `otpauth://totp/YourAppName?secret=${base32EncodedKey}&issuer=TOTPBindingService`;

        console.log("Secret Key: " + base32EncodedKey + " " + secretKey);
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
        post_confirmTokenBind();
        setTokenBindConfirmed(true);
    };

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        navigate('/');
    };


    return (
        <div className="container">
            <h1 className="heading">QR Code Generator</h1>
            
            {loading && <p>Loading...</p>}
            
            {error && <p>Error: {error}</p>}
            
            {!loading && !error && (
                <>
                    {!tokenBindConfirmed && (
                        <button onClick={generateSymmetricKey} className="button">Generate Symmetric Key</button>
                    )}
                    
                    {qrCodeVisible && (
                        <div className="container">
                            <QRCode value={otpAuthUrl} className="qr-container" />
                            <br></br>
                            {!tokenBindConfirmed && (
                                <button onClick={confirmTokenBind} className="button" >Confirm Token Bind</button>
                            )}
                        </div>
                    )}

                    <button onClick={handleLogout} className="logout-button">Logout</button>
                </>
            )}
        </div>
    );
};

export default QRCodePage;