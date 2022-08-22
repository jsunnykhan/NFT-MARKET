import { ethers } from "ethers";
import { useEffect, useState } from "react";

export const useConnect = () => {
  const [account, setAccount] = useState();
  const [chainId, setChainId] = useState();
  const [isMetamask, setIsMetamask] = useState();

  useEffect(() => {
    if (window.ethereum) {
      if (window.ethereum.isMetamask) {
        setIsMetamask((pre) => (pre = true));
      } else {
        setIsMetamask((pre) => (pre = false));
      }
      init();

      try {
        window.ethereum.on("accountsChanged", (accounts) => {
          setAccount((pre) => (pre = accounts[0]));
        });

        window.ethereum.on("chainChanged", (chain) => {
          setChainId((pre) => (pre = bigNumberToString(chain)));
        });
      } catch (error) {
        console.error(error);
      }
    }
  }, []);

  const init = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    const accounts = await provider.send("eth_accounts", []);
    const chain = await provider.send("eth_chainId", []);
    setAccount((pre) => (pre = accounts[0]));
    setChainId((pre) => (pre = bigNumberToString(chain)));
  };

  const bigNumberToString = (number) => {
    return ethers.BigNumber.from(number).toString();
  };

  const connect = async () => {
    if (window.ethereum) {
      setIsMetamask((pre) => (pre = true));
      const provider = new ethers.providers.Web3Provider(
        window.ethereum,
        "any"
      );
      await provider.send("eth_requestAccounts", []);
    } else {
      setIsMetamask((pre) => (pre = false));
    }
  };

  return [account, chainId, connect, isMetamask];
};
