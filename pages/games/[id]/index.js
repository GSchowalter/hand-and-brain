import React from "react";
import { useRouter } from "next/router";

const index = () => {
  const router = useRouter();
  const id = router.query.id;

  return <div>{id}</div>;
};

export default index;
