import React from "react";

const Dashboard = (props) => {
  const { artWork = 0, collections = 0, auctions = 0 } = props;
  return (
    <div className="bg-primary flex space-x-10 justify-between items-center">
      <div className="flex-shrink-0">
        <h1 className="capitalize lg:text-6xl xl:text-8xl text-white font-mono font-bold flex flex-col ">
          Create <span>your own</span>
          <span>
            <span className="text-secondary">NFT</span> Dream
          </span>
          Gallery
        </h1>
      </div>

      <div className="space-y-10 h-full items-center ">
        <p className="text-white font-medium text-xl font-serif">
          Digital marketplace for crypto collections and non-fungible tokens NFT
        </p>
        <div className="p-5 ring-1 ring-secondary rounded-lg flex justify-around">
          <div className="text-white font-normal text-xl font-serif flex justify-center flex-col items-center">
            <h3>{artWork}</h3>
            <h3>Art work</h3>
          </div>
          <div className="text-white font-normal text-xl font-serif flex justify-center flex-col items-center">
            <h3>{collections}</h3>
            <h3>Collections</h3>
          </div>
          <div className="text-white font-normal text-xl font-serif flex justify-center flex-col items-center">
            <h3>{auctions}</h3>
            <h3>Auctions</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
