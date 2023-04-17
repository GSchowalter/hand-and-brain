import { getAbsoluteUrl } from "@/utils/vercel-utilities";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const Test = () => {
  const [clientUrl, setClientUrl] = useState("whats going on?");

  let router = useRouter();
  useEffect(() => {
    setClientUrl(getAbsoluteUrl() + router.basePath);
    console.log(`effect was used: ${clientUrl}`);
  });
  return (
    <div>
      <p>test {clientUrl}</p>
    </div>
  );
};

export default Test;
