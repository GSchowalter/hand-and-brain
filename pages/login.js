import React, { useEffect, useState } from "react";
import { Auth } from "@/lib/auth";

const login = () => {
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    setAuth(new Auth());
  }, []);

  function handleLogin() {
    auth.login();
  }
  return (
    <div>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default login;
