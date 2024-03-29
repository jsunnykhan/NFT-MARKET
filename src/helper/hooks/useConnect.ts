import { ethers } from "ethers";
import { useEffect, useState } from "react";

export const useConnect = () => {
  const [account, setAccount] = useState<string | undefined>();
  const [chainId, setChainId] = useState<any>("");
  const [isMetamask, setIsMetamask] = useState<boolean>(false);
  const [isActive, setIsActive] = useState<boolean>(false);

  useEffect(() => {
    if (window.ethereum) {
      if (window.ethereum.isMetamask) {
        setIsMetamask((pre) => (pre = true));
      } else {
        setIsMetamask((pre) => (pre = false));
      }
      init();
      active()

      try {
        window.ethereum.on("accountsChanged", (accounts: any) => {
          setAccount((pre) => (pre = accounts[0]));
        });

        window.ethereum.on("chainChanged", (chain: any) => {
          setChainId((pre: any) => (pre = bigNumberToString(chain)));
        });
      } catch (error) {
        console.error(error);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive]);

  const init = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    const accounts = await provider.send("eth_accounts", []);
    const chain = await provider.send("eth_chainId", []);
    setAccount((pre: string | undefined) => (pre = accounts[0]));
    setChainId((pre: any) => (pre = bigNumberToString(chain)));
  };

  const active = () => {
    if (window.ethereum) {
      const ac: boolean = window.ethereum.isConnected();
      setIsActive(pre => pre = ac);
    }
  }

  const bigNumberToString = (number: number) => {
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

  return [account, chainId, connect, isMetamask, isActive];
};
