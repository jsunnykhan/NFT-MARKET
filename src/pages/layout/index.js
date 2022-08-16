import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";

import { StateContext } from "../../components/StateContex";
import Image from "next/image";

import { connect } from "../../helper/metamask.ts";

const routes = [
  {
    title: "Explore",
    url: "/",
  },
  {
    title: "Collectors",
    url: "/nft",
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

  useEffect(() => {
    const currentPath = router.route;
    setPath(currentPath);
  }, [router.route]);

  useEffect(() => {
    connect();
  }, [connect]);

  const { isHover, setIsHover } = useContext(StateContext);

  const [path, setPath] = useState(routes[0].url);

  const handleHoverEffect = (path) => {
    if (path === "/nft") {
      setIsHover(!isHover);
    }
  };

  return (
    <div className="relative select-none">
      <div className="w-full bg-primary flex justify-center">
        <div className="flex justify-between items-center sm:h-16 md:h-20 z-50 top-0 sticky shadow-md w-[90%]">
          <div className="flex">
            <Link href={routes[0].url} passHref>
              <div className="flex items-center space-x-3 cursor-pointe min-w-max">
                <Image
                  src="/Logo-reverse.png"
                  height={35}
                  width={30}
                  alt="unknown"
                />
                <h2 className="font-bold text-3xl text-secondary">Unknown</h2>
              </div>
            </Link>
          </div>
          <div>
            <ul className="flex w-full text-lg font-normal sm:space-x-5 md:space-x-10 font-serif text-white">
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

          <div
            className="px-10 py-3 ring-1 ring-white-200 hover:ring-secondary rounded-full text-white font-medium text-lg cursor-pointer"
            onClick={() => connect()}
          >
            <h3>Connect Wallet</h3>
          </div>
        </div>
      </div>

      <div onMouseOver={() => setIsHover(false)}>{props.children}</div>
    </div>
  );
};

export default Layout;
