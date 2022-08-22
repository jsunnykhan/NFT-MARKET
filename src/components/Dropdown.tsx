import React, { useEffect, useState } from "react";

interface collection {
  address: string;
  name: string;
  owner: string;
  symbol: string;
}
interface propsType {
  collections: Array<collection>;
  setCollectionAddress: Function;
  createCollection: () => {};
}

import { AiFillPlusCircle } from "react-icons/ai";

const Dropdown = (props: propsType) => {
  const { collections, setCollectionAddress, createCollection } = props;
  const [selected, setSelected] = useState<number>(0);

  useEffect(() => {
    setCollectionAddress((pre: any) => (pre = collections[0].address));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectedListener = (index: number, address: string) => {
    setSelected((pre) => (pre = index));
    setCollectionAddress((pre: any) => (pre = address));
  };

  return (
    <React.Fragment>
      <div className="space-y-4 py-5 w-full">
        <h3 className="text-base font-serif">Choose Collection</h3>

        <div className="w-full overflow-x-auto no-scrollbar scroll-auto">
          <div className="flex flex-row items-center p-2 space-x-5 w-screen">
            <div
              className="flex flex-col items-center justify-center ring-[0.5px] ring-white-100 w-28 h-28 rounded-lg cursor-pointer "
              onClick={createCollection}
            >
              <div className="flex flex-col justify-center items-center text-center w-full px-2 py-5">
                <AiFillPlusCircle size={24} />
                <h6 className="text-xs mt-2 font-mono text-white-100">
                  Create Collection
                </h6>
              </div>
            </div>

            {collections.map((col: collection, index: number) => (
              <div
                key={col.address}
                className={`flex flex-col items-center justify-center ring-[0.5px]  ${
                  index === selected ? "ring-secondary" : "ring-white-100"
                }  w-28 h-28 rounded-lg overflow-hidden`}
                onClick={() => selectedListener(index, col.address)}
              >
                <div className="flex flex-col justify-center items-center text-center w-full px-2 py-5">
                  <h4 className="text-sm font-mono capitalize">
                    {col.name.trim()}
                  </h4>
                  <h6 className="text-xs mt-2 font-serif text-white-100">
                    {col.symbol}
                  </h6>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Dropdown;
