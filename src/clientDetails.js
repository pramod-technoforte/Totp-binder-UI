const uibaseUrl = "https://esignet.dev.mosip.net";
const authorizeEndpoint = "/authorize";
const redirect_uri = process.env.PUBLIC_URL + "/qrcode";
const clientId = "88Vjt34c5Twz1oJ";
const scope = "openid profile";

const clientDetails = {
    uibaseUrl : uibaseUrl,
    authorizeEndpoint : authorizeEndpoint,
    redirect_uri : redirect_uri,
    clientId : clientId,
    scope : scope
}

export default clientDetails;