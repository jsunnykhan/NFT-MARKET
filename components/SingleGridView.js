import Image from "next/image";
import React, { useState } from "react";

const SingleGridView = (props) => {
  const { nft, isBuy, buyNFT, processing } = props;

  const [process, setProcess] = useState(false);
  return (
    <div className="h-full w-full rounded bg-gray-50 border">
      <Image
        className="rounded-t"
        src={nft.image}
        alt={nft.name}
        height={300}
        width={280}
        objectFit="cover"
      />
      <div className="p-2">
        <h3 className="text-lg font-semibold">{nft.name}</h3>
        <h4 className="font-semibold uppercase text-gray-400">
          {nft.price} eth
        </h4>
      </div>

      {isBuy && (
        <div className="flex justify-end pr-2 pb-2">
          <button
            className="bg-orange-400 px-3 py-2 rounded font-semibold text-base"
            onClick={() => {
              setProcess(true);
              buyNFT(nft);
            }}
          >
            {processing && process ? "Processing.." : "Buy NFT"}
          </button>
        </div>
      )}
    </div>
  );
};

export default SingleGridView;
