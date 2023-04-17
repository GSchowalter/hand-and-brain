import React, { useState, useEffect } from "react";
import { HttpClient, OAuth2AuthCodePKCE } from "@bity/oauth2-auth-code-pkce";
import { useRouter } from "next/router";

// import Chessground from "react-chessground";

export default () => {
  const lichessHost = "https://lichess.org";
  const scopes = ["board:play"];
  const clientId = "lichess-api-demo";

  const [clientUrl, setClientUrl] = useState("");
  const [oauth, setOAuth] = useState({});
  const [me, setMe] = useState("");

  useEffect(() => {
    const BASE_PATH = location.pathname.replace(/\/$/, "");
    const clientUrl = `${location.protocol}//${location.host}${
      BASE_PATH || "/"
    }`;
    setClientUrl(clientUrl);

    let _oauth = new OAuth2AuthCodePKCE({
      authorizationUrl: `${lichessHost}/oauth`,
      tokenUrl: `${lichessHost}/api/token`,
      clientId,
      scopes,
      redirectUrl: clientUrl,
      onAccessTokenExpiry: (refreshAccessToken) => refreshAccessToken(),
      onInvalidGrant: console.warn,
    });

    setOAuth(_oauth);
  });

  const authenticate = async () => {
    const httpClient = this.oauth.decorateFetchHTTPClient(window.fetch);
    const res = await httpClient(`${lichessHost}/api/account`);
    const _me = {
      ...(await res.json()),
      httpClient,
    };
    setMe(_me);
    // if (me.error) throw me.error;
    // this.me = me;
  };

  const handleClick = async () => {
    try {
      const accessContext = await this.oauth.getAccessToken();
      if (accessContext) await this.authenticate();
    } catch (err) {
      console.error(err);
    }
    if (!this.me) {
      try {
        const hasAuthCode = await this.oauth.isReturningFromAuthServer();
        if (hasAuthCode) await this.authenticate();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div>
      <p>Welcome to my hand and brain app</p>
      <button onClick={handleClick}>Press to authenticate</button>
    </div>
  );
};
