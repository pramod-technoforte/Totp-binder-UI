import clientDetails from "../config/clientDetails";

const post_fetchAccessToken = async (authCode) => {
    try {
        const response = await fetch(`${clientDetails.totpBinderServiceUrl}${clientDetails.authTokenEndpoint}`, {
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

const post_confirmTokenBind = async (accessToken, base32EncodedKey) => {
    try {
        const response = await fetch(`${clientDetails.totpBinderServiceUrl}${clientDetails.confirmTokenBindEndpoint}`, {
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
        
        return data.status;

    } catch (error) {
        console.error("Error confirming token bind:", error);
        throw error;
    }
};

export { post_fetchAccessToken, post_confirmTokenBind };
