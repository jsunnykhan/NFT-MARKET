import React from "react";
import Head from "next/head";
import SingleNFT from "../../features/SingleNft";
const index = () => {
  return (
    <div>
      <Head>
        <title>NFT</title>
      </Head>
      <SingleNFT />
    </div>
  );
};

export default index;
