window._env_ = {
  ESIGNET_UI_BASE_URL: "http://localhost:3000",
  REDIRECT_URI: "http://localhost:5000/userprofile",
  CLIENT_ID: "healthservices",
  ACR_VALUES:
    "mosip:idp:acr:generated-code%20mosip:idp:acr:biometrics%20mosip:idp:acr:static-code",
  SCOPE: "openid%20profile",
  USER_PROFILE_CLAIMS:
    "%7B%22userinfo%22:%7B%22given_name%22:%7B%22essential%22:true%7D,%22phone_number%22:%7B%22essential%22:false%7D,%22email%22:%7B%22essential%22:true%7D,%22picture%22:%7B%22essential%22:false%7D,%22gender%22:%7B%22essential%22:false%7D,%22birthdate%22:%7B%22essential%22:false%7D,%22address%22:%7B%22essential%22:false%7D%7D,%22id_token%22:%7B%7D%7D",
  DISPLAY: "page",
  PROMPT: "consent",
  MAX_AGE: 21,
  CLAIMS_LOCALES: "en",
  TOTP_DIGITS: 6,
  TOTP_PERIOD: 30,
};
