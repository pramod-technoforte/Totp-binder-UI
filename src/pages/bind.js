import React, { useState, useEffect } from "react";
import QRCode from "react-qr-code";
import { encode } from "hi-base32";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  post_fetchAccessToken,
  post_confirmTokenBind,
} from "../services/authService";
import Constants from "../constants/constant";
import FormAction from "../components/FormAction";
import clientDetails from "../config/clientDetails";

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
      const response = await post_confirmTokenBind(
        accessToken,
        base32EncodedKey
      );

      if (response === Constants.SUCCESS_MSG) {
        setSuccessMessage(Constants.BIND_SUCCESS_MSG);
        setTokenBindConfirmed(true);
      } else {
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
    navigate("/");
  };

  return (
    <>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {!loading && !error && (
        <section className="text-gray-600 mt-4 body-font">
          <div className="container flex mx-auto px-5 md:flex-row flex-col">
            <div className="flex justify-center mt-20 mb:mt-0 lg:w-1/2 md:w-1/2 w-5/6 mb-10 md:mb-0">
              <div>
                <img
                  className="object-contain "
                  src="images/background_img.png"
                />
              </div>
            </div>
            <div className="lg:flex-grow lg:px-24 md:px-16 flex flex-col">
              <div className="grid mt-20 w-full flex shadow-lg rounded bg-[#FFFFFF]">
                <div className="flex justify-center w-full mt-5">
                  <div className="row-span-5 w-96 self-start">
                    <div className="px-5 py-2">
                      <FormAction
                        id="General"
                        disabled={tokenBindConfirmed}
                        type={Constants.BUTTON}
                        text={Constants.GENERATE_KEY_BTN}
                        handleClick={generateSymmetricKey}
                      />
                    </div>
                  </div>
                </div>
                {qrCodeVisible && (
                  <>
                    <div className="flex justify-center">
                      <div className="row-span-5 self-start">
                        <div className="border border-1 border-#00000059 rounded-lg p-4">
                          <QRCode className="h-50" value={otpAuthUrl} />
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-center w-full">
                      <div className="row-span-5 w-96 self-start">
                        <div className="px-5 py-2">
                          <FormAction
                            id="General"
                            disabled={tokenBindConfirmed}
                            type={Constants.BUTTON}
                            text={Constants.CONFIRM_BIND_BTN}
                            handleClick={confirmTokenBind}
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}
                <div className="flex justify-center w-full mb-5">
                  <div className="row-span-5 w-96 self-start">
                    <div className="px-5 py-2">
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
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default Bind;
