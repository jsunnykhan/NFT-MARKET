import React from "react";
import Head from "next/head";
import UserProfile from "../../features/UserProfile";
const index = () => {
  return (
    <div>
      <Head>
        <title>My Collection</title>
      </Head>
      <UserProfile />
    </div>
  );
};

export default index;
