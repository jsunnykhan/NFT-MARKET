import { useRouter } from "next/router";
import React, { useContext } from "react";
import { StateContext } from "./StateContex";

const Drawer = () => {
  const { setIsHover, redirect, setRedirect } = useContext(StateContext);

  const nftPathHandler = (path) => {
    if (redirect.redirectUrl !== path) {
      setRedirect((pre) => (pre = { ...pre, redirectUrl: path }));
      setIsHover(false);
    }
  };

  console.log(redirect);

  return (
    <div className="w-max h-max bg-gray-100 px-5 py-3 flex flex-col divide-y divide-blue-400 shadow-md cursor-pointer space-y-1">
      <h2 className="text-sm " onClick={() => nftPathHandler("mint")}>
        Minted NFT
      </h2>
      <h2 className="text-sm" onClick={() => nftPathHandler("own")}>
        My Own NFT
      </h2>
    </div>
  );
};

export default Drawer;
