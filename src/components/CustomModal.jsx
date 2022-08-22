import React from "react";

const CustomModal = (props) => {
  return (
    <div className="justify-center bg-primary bg-opacity-60 items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
      {props.children}
    </div>
  );
};

export default CustomModal;
