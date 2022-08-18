import { useRouter } from "next/router";
import React from "react";

const SingleCollection = (props) => {
  const { index, item } = props;
  const route = useRouter();

  const changeRouter = () => {
    route.push(`collection/${item.returnValues.collectionAddress}`);
  };
  return (
    <div className="w-full cursor-pointer" onClick={changeRouter}>
      <div className="px-5 py-3 rounded-xl hover:bg-primary-100 hover:bg-opacity-40 w-full h-full text-white font-serif capitalize flex items-center space-x-10">
        <h2 className="text-xl font-mono">{index + 1}</h2>
        <div>
          <h3 className="text-xl truncate">{item.returnValues.name}</h3>
          <h4 className="text-lg truncate text-white-100">
            {item.returnValues.symbol}
          </h4>
        </div>
      </div>
    </div>
  );
};

export default SingleCollection;
