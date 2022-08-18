import React, { useEffect, useState } from 'react';

const BidModal = (props) => {
  const { Price, setPrice, bid, isBidModalOpen, setIsBidModalOpen } = props;

  const [valid, setValid] = useState(true);

  useEffect(() => {
    if (!isBidModalOpen) {
      console.log(true);
      return () => true;
    }
  }, [isBidModalOpen]);

  return (
    <div className="absolute top-0 left-0 right-0 bottom-0 z-30 w-full h-full bg-black bg-opacity-60 min-w-full min-h-screen">
      <div className="relative w-max h-max mt-40 m-auto items-center bg-white ring-1 ring-purple-100 rounded p-5">
        <p
          className="absolute top-0 right-3 font-bold cursor-pointer p-2 mb-20"
          onClick={() => setIsBidModalOpen(false)}
        >
          x
        </p>
        <h3 className="text-xl font-semibold pt-3">
          Please Enter your bid for Your NFT
        </h3>
        <p className="text-sm font-semibold pb-3">
          require vsc coin{' '}
          <span className="text-red-600 font-extrabold">*</span>
        </p>
        <div className="flex items-center h-full">
          <input
            className="bg-gray-100 w-full outline-none px-5 py-3 rounded-l-md"
            type="text"
            value={Price}
            onChange={(event) => setPrice((pre) => (pre = event.target.value))}
          />
          <h3 className="text-xs min-h-full font-semibold px-3 py-4 rounded-r shadow bg-gray-200 ">
            VSC
          </h3>
        </div>
        <button
          className="w-1/2 bg-blue-600 text-white text-xl font-semibold py-2.5 rounded-lg mt-10 disabled:bg-blue-200"
          onClick={bid}
        >
          Bid
        </button>
      </div>
    </div>
  );
};

export default BidModal;
