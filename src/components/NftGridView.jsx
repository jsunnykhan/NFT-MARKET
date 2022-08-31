import React from 'react';
import SingleGridView from './SingleGridView';

const NftGridView = (props) => {
  const { nftList, redirectDetailPage } = props;
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {nftList.map((item, index) => {
          return (
            <div
              key={index}
              onClick={() => {
                if (item.listingId) {
                  redirectDetailPage(
                    item.id,
                    item.collectionAddress,
                    item.listingId
                  );
                } else {
                  redirectDetailPage(item.id, item.collectionAddress);
                }
              }}
            >
              <SingleGridView
                key={item.id}
                nft={item}
                isBuy={false}
                processing={false}
                buyNFT={() => {}}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NftGridView;
