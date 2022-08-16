import CreateNFTToken from "../features/CreateNFTToken";
import React from "react";
import Head from "next/head";

const index = () => {
  return (
    <div>
      <Head>
        <title>Create NFT</title>
      </Head>
      <CreateNFTToken />
    </div>
  );
};

export default index;
