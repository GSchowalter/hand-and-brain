import React, { useState, useEffect } from "react";
import { HttpClient, OAuth2AuthCodePKCE } from "@bity/oauth2-auth-code-pkce";
import { useRouter } from "next/router";

export default function Home() {
  const lichessHost = "https://lichess.org";
  const scopes = ["board:play"];
  const clientId = "lichess-api-demo";
  let router = useRouter();
  let BASE_PATH = "";
  let clientUrl = "";
  useEffect(() => {
    // const BASE_PATH = location.pathname.replace(/\/$/, "");
    // const clientUrl = `${location.protocol}//${location.host}${BASE_PATH || "/"}`;
    BASE_PATH = router.basePath;
    clientUrl = router.asPath;

    let oauth = new OAuth2AuthCodePKCE({
      authorizationUrl: `${lichessHost}/oauth`,
      tokenUrl: `${lichessHost}/api/token`,
      clientId,
      scopes,
      redirectUrl: clientUrl,
      onAccessTokenExpiry: (refreshAccessToken) => refreshAccessToken(),
      onInvalidGrant: console.warn,
    });
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
