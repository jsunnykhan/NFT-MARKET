import React from "react";

const StatusBar = (props) => {
  const { status, text } = props;
  return (
    <div className="bg-green-500 h-max w-max p-0.5 flex items-center rounded shadow-lg animate-pulse duration-500 transition-all">
      <div className="rounded h-10 bg-white px-7 py-5 flex items-center text-base font-semibold">
        {text}
      </div>
    </div>
  );
};

export default StatusBar;
