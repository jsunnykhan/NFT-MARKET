import Link from "next/link";
import React from "react";

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
  return (
    <div>
      <div className="bg-slate-100 py-3 px-5">
        <ul className="flex text-center text-lg font-bold space-x-5">
          {routes.map((item) => (
            <Link href={item.url} passHref key={item.title}>
              <li className="cursor-pointer hover:text-purple-500">
                {item.title}
              </li>
            </Link>
          ))}
        </ul>
      </div>
      <div>{props.children}</div>
    </div>
  );
};

export default Layout;
