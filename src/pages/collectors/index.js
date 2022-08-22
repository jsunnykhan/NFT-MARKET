import React from "react";
import Head from "next/head";
import Collectors from "../../features/Collectors";
const index = () => {
  return (
    <div>
      <Head>
        <title>Collectors</title>
      </Head>
      <Collectors />
    </div>
  );
};

export default index;
