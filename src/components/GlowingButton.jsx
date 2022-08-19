import React from "react";

const GlowingButton = (props) => {
  const { text, route, tabHandler } = props;
  return (
    <div className="relative flex group" onClick={() => tabHandler(route)}>
      <div className="absolute top-0 bg-gradient-to-r from-pink-400 to-secondary rounded-full blur group-hover:blur-md group-hover:duration-300 inset-0 w-full h-full transition duration-1000"></div>
      <div className="relative w-full h-full bg-primary px-5 py-2 rounded-full font-bold cursor-pointer transition duration-700 group-hover:shadow-lg group-hover:duration-200">
        <h1 className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-secondary to-pink-400 text-center font-mono">
          {text}
        </h1>
      </div>
    </div>
  );
};

export default GlowingButton;
