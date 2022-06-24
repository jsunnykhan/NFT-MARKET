import React from "react";
import Image from "next/image";

const NFTDetail = () => {
  return (
    <div className="w-full p-5 flex h-screen">
      <div className="relative w-1/2 h-3/4 mt-12">
        <Image
          src={
            "https://ipfs.infura.io/ipfs/QmezyDC99xwWMLcHbU7Q4aPVHvgZ7NmNUN3mjfSctjsiJe"
          }
          alt={"NFT"}
          width={500}
          height={500}
          layout="fill"
          objectFit="fill"
          priority="true"
        />
      </div>

      <div className="w-1/2 h-1/2 ml-2">
        <div className="w-full flex justify-end">
          <button className="bg-blue-500 rounded-full px-6 py-2 font-bold text-white hover:bg-blue-700 transition-all duration-700">
            Sell NFT
          </button>
        </div>

        <h3 className="font-semibold capitalize text-4xl">Lina</h3>
        <p className="font-normal text-sm capitalize ml-1">{`The sibling rivalries between Lina the Slayer, and her younger sister Rylai, the Crystal Maiden, were the stuff of legend in the temperate region where they spent their quarrelsome childhoods together. Lina always had the advantage, however, for while Crystal was guileless and naive, Lina's fiery ardor was tempered by cleverness and conniving. The exasperated parents of these incompatible offspring went through half a dozen homesteads, losing one to fire, the next to ice, before they realized life would be simpler if the children were separated. As the oldest, Lina was sent far south to live with a patient aunt in the blazing Desert of Misrule, a climate that proved more than comfortable for the fiery Slayer. Her arrival made quite an impression on the somnolent locals, and more than one would-be suitor scorched his fingers or went away with singed eyebrows, his advances spurned. Lina is proud and confident, and nothing can dampen her flame.`}</p>
        <p className="font-base capitalize ml-1">$20.00</p>
        <p className="font-base capitalize ml-1">Lina</p>

        
      </div>
    </div>
  );
};

export default NFTDetail;
