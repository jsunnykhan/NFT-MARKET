import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";

import { StateContext } from "../../components/StateContex";
import Image from "next/image";

import SideBar from "../../components/SideBar.tsx";
import { useConnect } from "../../helper/hooks/useConnect.ts";

const routes = [
  {
    title: "Explore",
    url: "/",
  },
  {
    title: "Collectors",
    url: "/collectors",
  },
  {
    title: "Create",
    url: "/create",
  },
  {
    title: "Resources",
    url: "/resources",
  },
];

const Layout = (props) => {
  const router = useRouter();
  const { isHover, setIsHover } = useContext(StateContext);

  const [path, setPath] = useState(routes[0].url);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [account, chainId, connect, isMetamask] = useConnect();

  useEffect(() => {
    const currentPath = router.route;
    setPath(currentPath);
  }, [router.route]);

  const handleHoverEffect = (path) => {
    if (path === "/collectors") {
      setIsHover(!isHover);
    }
  };

  return (
    <div className="relative font-serif select-none">
      <div className="w-full bg-primary flex top-0 justify-center z-50 sticky">
        <div className="flex justify-between items-center sm:h-16 md:h-20 shadow-md w-[90%]">
          <div className="flex flex-1 ">
            <Link href={routes[0].url} passHref>
              <div className="flex items-center space-x-3 cursor-pointer min-w-max">
                <Image
                  src="/Logo-reverse.png"
                  height={30}
                  width={25}
                  alt="unknown"
                />
                <h2 className="font-semibold text-2xl text-secondary font-serif">
                  Unknown
                </h2>
              </div>
            </Link>
          </div>
          <div className="flex-1">
            <ul className="flex justify-center w-full text-lg font-normal sm:space-x-5 md:space-x-10 font-serif text-white">
              {routes.map((item) => (
                <div key={item.title} className="relative">
                  <Link href={item.url} passHref>
                    <li
                      className={`cursor-pointer hover:text-secondary tracking-wide ${
                        item.url == path && "text-secondary"
                      }`}
                      onMouseOver={() => handleHoverEffect(item.url)}
                    >
                      {item.title}
                    </li>
                  </Link>
                </div>
              ))}
            </ul>
          </div>
          <div className="flex-1">
            <div className="flex justify-end items-center">
              {account ? (
                <div
                  className="w-10 h-10 rounded-full bg-secondary cursor-pointer"
                  onClick={() => setSidebarOpen((pre) => (pre = !pre))}
                ></div>
              ) : (
                <div
                  className="w-min px-10 truncate py-3 ring-1 ring-white-200 hover:ring-secondary rounded-full text-white font-medium text-lg cursor-pointer"
                  onClick={() => connect()}
                >
                  <h3>Connect Wallet</h3>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="relative bg-primary text-white min-h-screen flex justify-center overflow-hidden">
        {sidebarOpen ? (
          <SideBar sidebarOpen={sidebarOpen} />
        ) : (
          <SideBar sidebarOpen={sidebarOpen} />
        )}
        <div
          className="w-[90%]"
          onClick={() => setSidebarOpen((pre) => (pre = false))}
        >
          {props.children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
