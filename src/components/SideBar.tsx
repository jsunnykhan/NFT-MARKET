import React, { useEffect, useState } from "react";
import { useConnect } from "../helper/hooks/useConnect";

import { FaPowerOff } from "react-icons/fa";
import { _getBalance, _getNativeBalance } from "helper/contracts";
import CustomSvg from "./CustomSvg";
import axios from "axios";

interface Chain {
  chainId: number;
  name: string;
}
interface walletType {
  account: string;
  chainInfo: Chain;
}

interface propsType {
  sidebarOpen: boolean;
}

const chainDetails: Chain[] = [
  {
    chainId: 1,
    name: "Mainnet",
  },
  {
    chainId: 3,
    name: "ropsten",
  },
  {
    chainId: 4,
    name: "rinkeby",
  },
  {
    chainId: 5,
    name: "goerli",
  },
  {
    chainId: 42,
    name: "goerli",
  },
  {
    chainId: 1337,
    name: "local",
  },
];

const SideBar = (props: propsType) => {
  const { sidebarOpen } = props;
  const [account, chainId, connect, isMetamask, isActive] = useConnect();

  const [wallet, setWallet] = useState<walletType | null>(null);
  const [ethBalance, setEthBalance] = useState<number>(0);
  const [nativeBalance, setNativeBalance] = useState<number>(0);
  const [selected, setSelected] = useState<string>("eth");
  const [inputField, setInputField] = useState<string>("");

  useEffect(() => {
    if (account) {
      const chainInfo = chain(`${chainId}`);
      setWallet(
        (pre) =>
          (pre = {
            account: `${account}`,
            chainInfo: chainInfo,
          })
      );
      getBalance(account);
      getNativeBalance(account);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, chainId]);

  const getBalance = async (account: string) => {
    const balances = await _getBalance(account);
    setEthBalance((pre: any) => (pre = balances));
  };

  const getNativeBalance = async (address: string) => {
    const balance = await _getNativeBalance(address);
    setNativeBalance((pre) => (pre = balance));
  };
  const chain = (chainId: string) => {
    const filterChain = chainDetails.filter(
      (data) => data.chainId === Number(chainId)
    );
    return filterChain[0];
  };

  const swapCoin = async () => {
    const data = await axios.post("/api/swapvs", {
      amount: inputField,
      address: account,
    });
    console.log(data.data);
  };
  return (
    <div className="fixed right-2 z-40">
      <div
        className={`rounded-md w-[25vw] space-y-5 h-max px-5 py-10 bg-slate-900 transform transition-all duration-300 ${
          sidebarOpen ? "translate-x-0" : "translate-x-[26vw]"
        }`}
      >
        {/* wallet information */}
        <div className="flex flex-col space-y-5 rounded-lg ring-1 ring-gray-800 px-3 py-3 overflow-hidden">
          <div className="flex space-x-1 items-center">
            <div className="flex flex-col justify-center w-full">
              <h4 className="capitalize">{wallet?.chainInfo.name}</h4>
              <p className="overflow-hidden text-xs select-all truncate w-[14vw] text-white-100">
                {wallet?.account}
              </p>
            </div>
            <div className="w-min px-3 py-3 rounded-full bg-gray-800">
              <FaPowerOff />
            </div>
          </div>
          {/* wallet balance */}
          <div className="flex justify-evenly overflow-hidden">
            <div className="flex space-x-3 items-center">
              <CustomSvg url="/ethereum.svg" size={25} />
              <p>{ethBalance.toFixed(2)}</p>
            </div>
            <div className="flex space-x-3 items-center">
              <CustomSvg url="/ethereum.svg" size={25} />
              <p>{nativeBalance.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* currency swap */}

        <div className="flex flex-col space-y-3 rounded-lg ring-1 ring-gray-800 px-3 py-3 overflow-hidden">
          <div className="flex flex-col space-y-5">
            <h4 className="text-md text-center text-white-100 overflow-hidden">
              Swap Rate : <span className="text-white">{1}</span> ETH ={" "}
              <span className="text-white">{2}</span> VS
            </h4>

            <input
              className="px-5 py-3 rounded-md  w-full bg-gray-800 shadow-md focus:outline-none text-white-100 text-sm"
              placeholder="Amount of VS Coin"
              value={inputField}
              onChange={(event) =>
                setInputField((pre) => (pre = event.target.value))
              }
            />
            <div
              className="px-5 py-3 w-max rounded-md bg-gray-800 shadow-md text-sm self-end text-center mr-1 cursor-pointer"
              onClick={swapCoin}
            >
              Buy VS
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
