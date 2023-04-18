import React, { useState, useEffect } from "react";
import { HttpClient, OAuth2AuthCodePKCE } from "@bity/oauth2-auth-code-pkce";
import { useRouter } from "next/router";
import { getAbsoluteUrl } from "@/utils/vercel-utilities";
import { Auth } from "@/utils/auth";
import Link from "next/link";

export default function Home() {
  let [oauth, setOAuth] = useState(null);

  const lichessHost = "https://lichess.org";
  const scopes = ["board:play"];
  const clientId = "lichess-api-demo";
  let router = useRouter();
  let BASE_PATH = "";
  let clientUrl = "";

  async function login() {
    await oauth.fetchAuthorizationCode();
  }

  const authenticate = async () => {
    const httpClient = oauth.decorateFetchHTTPClient(window.fetch);
    const res = await httpClient(`${lichessHost}/api/account`);
    const me = {
      ...(await res.json()),
      httpClient,
    };
    if (me.error) throw me.error;
    // this.me = me;
  };

  async function init() {
    try {
      console.log(oauth);
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

    setOAuth(
      new OAuth2AuthCodePKCE({
        authorizationUrl: `${lichessHost}/oauth`,
        tokenUrl: `${lichessHost}/api/token`,
        clientId,
        scopes,
        redirectUrl: clientUrl,
        onAccessTokenExpiry: (refreshAccessToken) => refreshAccessToken(),
        onInvalidGrant: console.warn,
      })
    );

    if (oauth) {
      init();
    }
  }, []);

  function handleClick() {
    return;
  }

  return (
    <div>
      <p>Welcome to my hand and brain app</p>
      <Link href="/login">Press to authenticate</Link>
    </div>
  );
}
