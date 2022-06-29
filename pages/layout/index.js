import Link from "next/link";
import React from "react";
import { useRouter } from "next/router";
import StatusBar from "../../components/statusBar";

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
  return (
    <div className="relative ">
      <div className="bg-gray-50 flex items-center w-full h-16 z-50 top-0 sticky shadow-md">
        <h1 className="w-full">Market place Name</h1>
        <ul className="flex w-full justify-end pr-10 text-lg font-bold space-x-5">
          {routes.map((item) => (
            <div key={item.title} className="relative">
              <Link href={item.url} passHref>
                <li className="cursor-pointer hover:text-blue-400">
                  {item.title}
                </li>
              </Link>

              {item.url === router.route && (
                <div className="absolute -bottom-5 w-full h-0.5 rounded-tr rounded-tl bg-blue-600"></div>
              )}
            </div>
          ))}
        </ul>
      </div>
      <div>{props.children}</div>

      <div className="bottom-5 sticky z-50 mx-5 ">
        <StatusBar text="Minting ..."/>
      </div>
    </div>
  );
};

export default Layout;
