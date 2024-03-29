import { MobileDateTimePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import TextField from '@mui/material/TextField';
import React, { useEffect, useState } from 'react';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import CustomModal from './CustomModal';

const AuctionModal = (props) => {
  const {
    basePrice,
    setBasePrice,
    auctionItemsIntoMarket,
    isAuctionModalOpen,
    setAuctionTime,
    setIsAuctionModalOpen,
  } = props;

  const [valid, setValid] = useState(true);
  const [value, setValue] = useState(new Date());

  useEffect(() => {
    if (!isAuctionModalOpen) {
      console.log(true);
      return () => true;
    }
  }, [isAuctionModalOpen]);

  return (
    <CustomModal>
      <div className="text-primary absolute top-0 left-0 right-0 bottom-0 z-30 w-full h-full bg-black bg-opacity-60 min-w-full min-h-screen">
        <div className="relative w-max h-max mt-40 m-auto items-center bg-white ring-1 ring-purple-100 rounded p-5">
          <p
            className="absolute top-0 right-3 font-bold cursor-pointer p-2 mb-20"
            onClick={() => setIsAuctionModalOpen(false)}
          >
            x
          </p>
          <h3 className="text-xl font-semibold pt-3">
            Please Enter Base price for Your NFT
          </h3>
          <p className="text-sm font-semibold pb-3">
            require vsc coin{' '}
            <span className="text-red-600 font-extrabold">*</span>
          </p>
          <div className="flex items-center h-full mb-4">
            <input
              className="bg-gray-100 w-full outline-none px-5 py-3 rounded-l-md"
              type="text"
              value={basePrice}
              onChange={(event) =>
                setBasePrice((pre) => (pre = event.target.value))
              }
            />
            <h3 className="text-xs min-h-full font-semibold px-3 py-4 rounded-r shadow bg-gray-200 ">
              VSC
            </h3>
          </div>
          <div className="flex items-center h-full">
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <MobileDateTimePicker
                label="Pick Auction end time"
                value={value}
                onChange={(newValue) => {
                  console.log(newValue.format('MM-DD-YYYY HH:mm:ss'));
                  setValue(newValue);
                  setAuctionTime(newValue.format('MM-DD-YYYY HH:mm:ss'));
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </div>
          <button
            className="w-1/2 bg-blue-600 text-white text-xl font-semibold py-2.5 rounded-lg mt-10 disabled:bg-blue-200"
            onClick={auctionItemsIntoMarket}
          >
            Start Auction
          </button>
        </div>
      </div>
    </CustomModal>
  );
};

export default AuctionModal;
