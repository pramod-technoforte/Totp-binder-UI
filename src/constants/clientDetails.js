const state = "eree2311";
const nonce = "ere973eieljznge2311";
const responseType = "code";
const uibaseUrl = "https://esignet.onpremdev.idencode.link";
const authorizeEndpoint = "/authorize";
const redirect_uri = "http://localhost:3000/qrcode";
const clientId = "8ev-FWq7jvTk5SiZuEntodtN1WPa_SZxNNgK3OdqcG0";
const scope = "openid profile";
const acr_values = "mosip:idp:acr:generated-code%20mosip:idp:acr:time-generated-code%20mosip:idp:acr:biometrics%20mosip:idp:acr:static-code";
const display = "page";
const prompt = "consent";
const maxAge = 21;
const claimsLocales = "en";
const userProfileClaims = "%7B%22userinfo%22:%7B%22given_name%22:%7B%22essential%22:true%7D,%22phone_number%22:%7B%22essential%22:false%7D,%22email%22:%7B%22essential%22:true%7D,%22picture%22:%7B%22essential%22:false%7D,%22gender%22:%7B%22essential%22:false%7D,%22birthdate%22:%7B%22essential%22:false%7D,%22address%22:%7B%22essential%22:false%7D%7D,%22id_token%22:%7B%7D%7D";
const registrationClaims = "%7B%22userinfo%22:%7B%22given_name%22:%7B%22essential%22:true%7D,%22phone_number%22:%7B%22essential%22:false%7D,%22email%22:%7B%22essential%22:true%7D,%22picture%22:%7B%22essential%22:false%7D,%22gender%22:%7B%22essential%22:false%7D,%22birthdate%22:%7B%22essential%22:false%7D,%22address%22:%7B%22essential%22:false%7D%7D,%22id_token%22:%7B%7D%7D";

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
    clientId : clientId,
    scope : scope,
    acr_values : acr_values,
    display : display,
    prompt : prompt,
    max_age : maxAge,
    claims_locales : claimsLocales,
    userProfileClaims: userProfileClaims ?? encodeURI(JSON.stringify(claims)),
    registrationClaims: registrationClaims ?? encodeURI(JSON.stringify(claims))
}

export default clientDetails;