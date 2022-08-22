import Link from 'next/link';
import React from 'react';
import SingleGridView from './SingleGridView';

const NftGridView = (props) => {
  const { nftList, redirectNftDetailPage } = props;
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {nftList.map((item) => (
          <div key={item.tokenId} onClick={() => redirectNftDetailPage(item.tokenId, item.collectionAddress)}>
            <SingleGridView
              key={item.tokenId}
              nft={item}
              isBuy={false}
              processing={false}
              buyNFT={() => {}}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default NftGridView;
