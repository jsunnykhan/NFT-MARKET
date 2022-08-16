import CreateNFTToken from "../features/CreateNftToken";
import React from "react";
import Head from "next/head";

const CreateNFTPage = () => {
  return (
    <div>
      <Head>
        <title>create nft</title>
      </Head>
      <CreateNFTToken />
    </div>
  );
};

export default CreateNFTPage;
