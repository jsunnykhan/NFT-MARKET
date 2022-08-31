import Image from 'next/image';
import React, { useState } from 'react';
import { ipfsToHttp } from '../helper/ipfsToHttp.ts';

const SingleGridView = (props) => {
  const { nft, isBuy, buyNFT, processing } = props;
  const [process, setProcess] = useState(false);

  return (
    <div className="h-full w-full rounded cursor-pointer ring-1 ring-secondary ring-opacity-40">
      <div className="h-[200px] relative">
        <Image
          className="rounded-t"
          src={nft.image}
          alt={nft.name}
          layout="fill"
          objectFit="cover"
          objectPosition="center"
        />
      </div>
      <div className="h-1/5 rounded-b py-1">
        <div className="p-2">
          <h3 className="text-lg text-white font-semibold truncate">
            {nft.name}
          </h3>
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-medium uppercase text-gray-400 truncate">
              {nft.price ? nft.price : nft.description}
            </h4>
            {nft.price && (
              <Image
                src="/Logo-reverse.png"
                width={10}
                height={12}
                alt="logo"
              />
            )}
          </div>
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
              {processing && process ? 'Processing..' : 'Buy NFT'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SingleGridView;
