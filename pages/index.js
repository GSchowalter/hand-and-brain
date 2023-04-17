import React, { useState, useEffect } from "react";
import { HttpClient, OAuth2AuthCodePKCE } from "@bity/oauth2-auth-code-pkce";
import { useRouter } from "next/router";
import { getAbsoluteUrl } from "@/utils/vercel-utilities";

export default function Home() {
  const lichessHost = "https://lichess.org";
  const scopes = ["board:play"];
  const clientId = "lichess-api-demo";
  let router = useRouter();
  let BASE_PATH = "";
  let clientUrl = "";

  const authenticate = async (oauth) => {
    const httpClient = oauth.decorateFetchHTTPClient(window.fetch);
    const res = await httpClient(`${lichessHost}/api/account`);
    const me = {
      ...(await res.json()),
      httpClient,
    };
    if (me.error) throw me.error;
    // this.me = me;
  };

  async function init(oauth) {
    try {
      const accessContext = await oauth.getAccessToken();
      if (accessContext) await authenticate();
    } catch (err) {
      console.error(err);
    }
    // TODO implement this in a react functional way
    // if (!this.me) {
    //   try {
    //     const hasAuthCode = await oauth.isReturningFromAuthServer();
    //     if (hasAuthCode) await authenticate();
    //   } catch (err) {
    //     console.error(err);
    //   }
    // }
  }

  useEffect(() => {
    // const BASE_PATH = location.pathname.replace(/\/$/, "");
    // const clientUrl = `${location.protocol}//${location.host}${BASE_PATH || "/"}`;
    BASE_PATH = router.basePath;
    clientUrl = getAbsoluteUrl() + BASE_PATH;

    let oauth = new OAuth2AuthCodePKCE({
      authorizationUrl: `${lichessHost}/oauth`,
      tokenUrl: `${lichessHost}/api/token`,
      clientId,
      scopes,
      redirectUrl: clientUrl,
      onAccessTokenExpiry: (refreshAccessToken) => refreshAccessToken(),
      onInvalidGrant: console.warn,
    });

    init(oauth);
  }, []);

  function handleClick() {
    console.log(`Base path: ${BASE_PATH}`);
    console.log(`Client URL: ${clientUrl}`);
    return;
  }

  return (
    <div>
      <p>Welcome to my hand and brain app</p>
      <button onClick={handleClick}>Press to authenticate</button>
    </div>
  );
}
