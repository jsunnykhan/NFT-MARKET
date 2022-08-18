import React from 'react';
import Head from 'next/head';
import Auction from '../../features/Auction';

const index = () => {
  return (
    <div>
      <Head>
        <title>Auction</title>
      </Head>
      <Auction />
    </div>
  );
};

export default index;
