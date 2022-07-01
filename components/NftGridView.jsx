import Link from "next/link";
import React from "react";
import SingleGridView from "./SingleGridView";

const NftGridView = (props) => {
  const {nftList , notFoundMessage ,redirectNftDetailPage } =props;
  return (
    <div className="w-full">
      {!nftList.length ? (
        <p className="flex text-center mx-auto justify-center">{notFoundMessage}</p>
      ) : (
        <div className="w-full h-full grid grid-cols-4 gap-5 lg:gap-10">
          {nftList.map((item) => (
              <div key={item.tokenId} onClick={()=> redirectNftDetailPage(item)}>
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
      )}
    </div>
  );
};

export default NftGridView;
