import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import Collection from "../../features/Collection";

const CollectionPage = () => {
  const route = useRouter();
  const { cid } = route.query;

  return (
    <div>
      <Head>
        <title>Collection</title>
      </Head>
      <Collection address={cid} />
    </div>
  );
};

export default CollectionPage;


