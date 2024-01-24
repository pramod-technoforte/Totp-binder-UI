const state = "eree2311";
const nonce = "ere973eieljznge2311";
const responseType = "code";
const uibaseUrl = process.env.REACT_APP_ESIGNET_UI_BASE_URL ?? "https://esignet.onpremdev.idencode.link";
const authorizeEndpoint = "/authorize";
const redirect_uri = process.env.REACT_APP_REDIRECT_URI ?? "https://totp-binder-service.onpremdev.idencode.link/qrcode";
const totpBinderServiceUrl = process.env.REACT_APP_TOTP_BINDER_SERVICE_URL ?? "https://api-internal.onpremdev.idencode.link/v1/totp";
const authTokenEndpoint = "/oauth/token";
const confirmTokenBindEndpoint = "/binding/totp-key-bind";
const clientId = process.env.REACT_APP_CLIENT_ID ?? "8ev-FWq7jvTk5SiZuEntodtN1WPa_SZxNNgK3OdqcG0";
const scope = "openid profile";
const acr_values = process.env.REACT_APP_ACR_VALUES ?? "mosip:idp:acr:generated-code";
const display = process.env.REACT_APP_DISPLAY ?? "page";
const prompt = process.env.REACT_APP_PROMPT ?? "consent";
const maxAge = process.env.REACT_APP_MAX_AGE ?? 21;
const claimsLocales = process.env.REACT_APP_CLAIMS_LOCALES ?? "en";
const userProfileClaims = process.env.REACT_APP_USER_PROFILE_CLAIMS ?? "%7B%22userinfo%22:%7B%22given_name%22:%7B%22essential%22:true%7D,%22phone_number%22:%7B%22essential%22:false%7D,%22email%22:%7B%22essential%22:true%7D,%22picture%22:%7B%22essential%22:false%7D,%22gender%22:%7B%22essential%22:false%7D,%22birthdate%22:%7B%22essential%22:false%7D,%22address%22:%7B%22essential%22:false%7D%7D,%22id_token%22:%7B%7D%7D";
const registrationClaims = process.env.REACT_APP_REGISTRATION_CLAIMS ?? "%7B%22userinfo%22:%7B%22given_name%22:%7B%22essential%22:true%7D,%22phone_number%22:%7B%22essential%22:false%7D,%22email%22:%7B%22essential%22:true%7D,%22picture%22:%7B%22essential%22:false%7D,%22gender%22:%7B%22essential%22:false%7D,%22birthdate%22:%7B%22essential%22:false%7D,%22address%22:%7B%22essential%22:false%7D%7D,%22id_token%22:%7B%7D%7D";
const digitsInTotp = process.env.REACT_APP_TOTP_DIGITS ?? "6";
const periodOfTotp = process.env.REACT_APP_TOTP_PERIOD ?? "30";

const claims = {
    userinfo: {
        given_name: {
            essential: true,
        },
        phone_number: {
            essential: false,
        },
        email: {
            essential: true,
        },
        picture: {
            essential: false,
        },
        gender: {
            essential: false,
        },
        birthdate: {
            essential: false,
        },
        address: {
            essential: false,
        },
    },
    id_token: {},
}

const clientDetails = {
    state : state,
    nonce : nonce,
    response_type : responseType,
    uibaseUrl : uibaseUrl,
    authorizeEndpoint : authorizeEndpoint,
    redirect_uri : redirect_uri,
    totpBinderServiceUrl: totpBinderServiceUrl,
    authTokenEndpoint: authTokenEndpoint,
    confirmTokenBindEndpoint: confirmTokenBindEndpoint,
    clientId : clientId,
    scope : scope,
    acr_values : acr_values,
    display : display,
    prompt : prompt,
    max_age : maxAge,
    claims_locales : claimsLocales,
    userProfileClaims: userProfileClaims ?? encodeURI(JSON.stringify(claims)),
    registrationClaims: registrationClaims ?? encodeURI(JSON.stringify(claims)),
    digitsInTotp: digitsInTotp,
    periodOfTotp: periodOfTotp
}

export default clientDetails;
