import { ethers } from 'ethers';
import React from 'react';
import { useCountdown } from '../../hooks/useCountdown';
import ShowCounter from './ShowCounter';
import { ERC20_TOKEN, Market_ADDRESS, NFT_ADDRESS } from '../../config';
import Market from '../../artifacts/contracts/NFTMarket.sol/NFTMarket.json';

const CountdownTimer = ({ targetDate, id, itemId }) => {
  const [days, hours, minutes, seconds] = useCountdown(targetDate);
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  async function onFinish() {
    const newAuction = new ethers.Contract(Market_ADDRESS, Market.abi, signer);
    const tx = await newAuction.auctionEnd(
      id,
      ERC20_TOKEN,
      itemId,
      NFT_ADDRESS
    );
    tx.wait();
    console.log('Auction ended!!!');
  }
  if (days + hours + minutes + seconds === 0) {
    setTimeout(onFinish, 3000);
    <ShowCounter days={0} hours={0} minutes={0} seconds={0} />;
  } else if (days + hours + minutes + seconds < 0) {
    return (
      <div>
        <button
          className="w-[20%] bg-blue-600 text-white text-2xl font-semibold py-3 rounded-lg mx-2"
          onClick={onFinish}
        >
          End Auction
        </button>
      </div>
    );
  } else {
    return (
      <ShowCounter
        days={days}
        hours={hours}
        minutes={minutes}
        seconds={seconds}
      />
    );
  }
};

export default CountdownTimer;
