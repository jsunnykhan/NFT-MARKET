import React, { createContext, useState } from "react";

export const StateContext = createContext();

const StateContextProvider = (props) => {
  const [isHover, setIsHover] = useState(false);
  const [redirect, setRedirect] = useState({
    baseUrl: "/nft",
    redirectUrl: "mint",
  });

  const [singleNft, setSingleNft] = useState([]);

  return (
    <StateContext.Provider
      value={{
        isHover,
        setIsHover,
        redirect,
        setRedirect,
        singleNft,
        setSingleNft,
      }}
    >
      {props.children}
    </StateContext.Provider>
  );
};

export default StateContextProvider;
