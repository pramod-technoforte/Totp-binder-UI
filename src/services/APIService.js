import ClientDetails from "../config/ClientDetails";

const post_fetchAccessToken = async (authCode) => {
  try {
    const response = await fetch(
      `${ClientDetails.totpBinderServiceUrl}${ClientDetails.authTokenEndpoint}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: authCode,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    if (data.response == null) {
      throw new Error(
        `API call received with error: ${data.errors[0].message}`
      );
    }

    const token = data.response.accessToken;

    return token;
  } catch (error) {
    console.error("Error fetching access token:", error);
    throw error;
  }
};

const get_generateSymmetricKey = async () => {
  const response = await fetch(
    `${ClientDetails.totpBinderServiceUrl}${ClientDetails.generateKeyEndpoint}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  const data = await response.json();

  if (data.response == null) {
    throw new Error(`API call received with error: ${data.errors[0].message}`);
  }

  return data.response;
};

const post_confirmTokenBind = async (accessToken, base32EncodedKey) => {
  try {
    const response = await fetch(
      `${ClientDetails.totpBinderServiceUrl}${ClientDetails.confirmTokenBindEndpoint}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          totpKey: base32EncodedKey,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    if (data.response == null) {
      throw new Error(
        `API call received with error: ${data.errors[0].message}`
      );
    }

    return data.response.status;
  } catch (error) {
    console.error("Error confirming token bind:", error);
    throw error;
  }
};

export {
  post_fetchAccessToken,
  get_generateSymmetricKey,
  post_confirmTokenBind,
};
