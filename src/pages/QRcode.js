import React, {useState} from "react";
import QRCode from 'react-qr-code';
import { encode } from 'hi-base32';
import '../styles/generateQR.css';

const QRCodePage = () => {
    const [otpAuthUrl, setOtpAuthUrl] = useState('');
    const [qrCodeVisible, setQRCodeVisible] = useState(false);
    const [tokenBindConfirmed, setTokenBindConfirmed] = useState(false);

    const generateSymmetricKey = () => {
        const secretKey = generateRandomSecretKey();
        const base32EncodedKey = encode(secretKey);
        const otpAuthUrl = `otpauth://totp/YourAppName:${encodeURIComponent('user@example.com')}?secret=${base32EncodedKey}&issuer=TOTPBindingService`;

        setOtpAuthUrl(otpAuthUrl);
        setQRCodeVisible(true);
        setTokenBindConfirmed(false);
    };

    const confirmTokenBind = () => {
        setTokenBindConfirmed(true);
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


    return (
        <div className="container">
            <h1 className="heading">QR Code Generator</h1>
            <button onClick={generateSymmetricKey} className="button">Generate Symmetric Key</button>
            {qrCodeVisible && (
            <div className="container">
                {/* <p>{otpAuthUrl}</p> */}
                <QRCode value={otpAuthUrl} className="qr-container"/>
                <br></br>
                {!tokenBindConfirmed && (
                    <button onClick={confirmTokenBind} className="button">Confirm Token Bind</button>
                )}
            </div>
            )}
        </div>
    );
};

export default QRCodePage;