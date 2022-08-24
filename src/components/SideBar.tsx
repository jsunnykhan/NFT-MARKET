import React, { useEffect, useState } from "react";
import { useConnect } from "../helper/hooks/useConnect";

interface walletType {
  account: string;
  chainId: string | number;
}

// const chain = [{
//     chainId:
// }];

const SideBar = () => {
  const [account, chainId, connect, isMetamask] = useConnect();

  const [wallet, setWallet] = useState<walletType | null>(null);

  useEffect(() => {
    if (account) {
      setWallet(
        (pre) =>
          (pre = {
            account: `${account}`,
            chainId: `${chainId}`,
          })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]);

  return (
    <div className="absolute top-0 right-2 z-40">
      <div className="rounded-md w-[25vw] h-max px-5 py-10 bg-slate-900 ">
        {/* wallet information */}
        <div className="flex space-y-3 flex-col">
          <h3 className="font-mono capitalize font-semibold text-xl text-center">
            My Wallet
          </h3>
          <h4 className="truncate text-white-200 text-xs">{wallet?.account}</h4>
          <h4 className="truncate text-white-200 text-xs">{wallet?.chainId}</h4>
        </div>
        {/* currency swap */}
      </div>
    </div>
  );
};

export default SideBar;
