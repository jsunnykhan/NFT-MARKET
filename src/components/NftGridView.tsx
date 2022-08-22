import Link from "next/link";
import React from "react";
import SingleGridView from "./SingleGridView";

enum Types {
  AUCTION,
  SELL,
  NORMAL,
}

interface propsType {
  nftList: [];
  redirectNftDetailPage: Function;
  type?: Types;
}

const NftGridView = (props: propsType) => {
  const { nftList, redirectNftDetailPage, type = Types.AUCTION } = props;

  const buyNFT = (id: string, address: string) => {};
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {nftList.map((item: any) => (
          <div
            key={item.tokenId}
            onClick={() =>
              redirectNftDetailPage(item.tokenId, item.collectionAddress)
            }
          >
            <SingleGridView
              nft={item}
              types={type}
              processing={false}
              buyNFT={buyNFT}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default NftGridView;
