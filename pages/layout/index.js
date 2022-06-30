import Link from "next/link";
import React, { useContext, useState } from "react";
import { useRouter } from "next/router";
import StatusBar from "../../components/statusBar";
import Drawer from "../../components/Drawer";
import { StateContext } from "../../components/StateContex";
import Image from "next/image";

const routes = [
  {
    title: "Home",
    url: "/",
  },
  {
    title: "My NFT",
    url: "/nft",
  },
  {
    title: "Create NFT",
    url: "/create-nft",
  },
];

const Layout = (props) => {
  const router = useRouter();

  const { isHover, setIsHover } = useContext(StateContext);

  const handleHoverEffect = (path) => {
    if (path === "/nft") {
      setIsHover(!isHover);
    }
  };

  return (
    <div className="relative select-none">
      <div className="bg-gray-50 flex items-center w-full h-16 z-50 top-0 sticky shadow-md">
        <div className="pl-10 flex items-center space-x-3 w-full">
          <Image
            src="/Logo-reverse.png"
            height={35}
            width={30}
            alt="Dark Sea"
          />
          <h2 className="font-bold text-3xl text-blue-500">Dark Sea</h2>
        </div>
        <ul className="flex w-full justify-end pr-10 text-lg font-bold space-x-5">
          {routes.map((item) => (
            <div key={item.title} className="relative">
              <Link href={item.url} passHref>
                <li
                  className="cursor-pointer hover:text-blue-400"
                  onMouseOver={() => handleHoverEffect(item.url)}
                >
                  {item.title}
                </li>
              </Link>

              {item.url === router.route && (
                <div className="absolute -bottom-5 w-full h-0.5 rounded-tr rounded-tl bg-blue-600"></div>
              )}
              {router.route === "/nft" && isHover ? (
                item.url === "/nft" ? (
                  <div
                    className="absolute top-12 right-0"
                    onMouseLeave={handleHoverEffect}
                  >
                    <Drawer />
                  </div>
                ) : null
              ) : null}
            </div>
          ))}
        </ul>
      </div>

      <div onMouseOver={() => setIsHover(false)}>{props.children}</div>

      {/* <div className="bottom-5 sticky z-50 mx-5 ">
        <StatusBar text="Minting ..."/>
      </div> */}
    </div>
  );
};

export default Layout;
