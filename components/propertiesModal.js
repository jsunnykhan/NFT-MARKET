import React, { useEffect, useState } from "react";

const PropertiesModal = (props) => {
  const { attributes, setAttributes, isModalOpen, setIsModalOpen } = props;
  const [property, setProperty] = useState([
    {
      trait_type: "",
      value: "",
    },
  ]);

  useEffect(() => {
    if (attributes.length > 0) {
      setProperty(attributes);
    }
    if (!isModalOpen) {
      return true;
    }
  }, [isModalOpen]);

  const addProperty = () => {
    const length = property.length;
    setProperty((pre) => (pre = [...pre, { trait_type: "", value: "" }]));
  };

  const removeProperty = (index) => {
    if (index > 0) {
      property.splice(index, 1);
      setProperty((pre) => (pre = [...property]));
    }
  };

  const saveProperty = () => {
    if (property[0].trait_type === "" && property[0].value === "") {
      setAttributes([]);
    } else {
      setAttributes(property);
    }
    //close modal
    closeModal();
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="flex justify-center items-center py-10">
      <div className="w-2/5 rounded bg-white px-5">
        <div className="flex justify-between items-center px-5 py-5">
          <h2 className="text-2xl font-semibold"></h2>
          <h2 className="text-2xl font-semibold">Add Properties</h2>
          <h2
            onClick={closeModal}
            className="text-2xl font-semibold cursor-pointer"
          >
            x
          </h2>
        </div>

        <h3 className="text-gray-500 text-base py-5">
          {` Properties show up underneath your item, are clickable, and can be
          filtered in your collection's sidebar.`}
        </h3>

        <div className="flex flex-col space-y-5 mb-10">
          {property.map((data, index) => (
            <div key={index} className="flex justify-center">
              <h3
                onClick={() => removeProperty(index)}
                className="h-min w-min px-5 py-3 bg-gray-200 text-base font-bold rounded-tl-md rounded-bl-md hover:shadow-md transition-all duration-300 cursor-pointer"
              >
                X
              </h3>
              <input
                type="text"
                value={property[index].trait_type}
                onChange={(event) => {
                  const a = property[index];
                  const obj = {
                    ...a,
                    trait_type: event.target.value,
                  };
                  property.splice(index, 1);
                  const fullArray = [...property, obj];
                  setProperty((preState) => (preState = fullArray));
                }}
                className="bg-gray-100 w-2/4 outline-none px-5"
              />
              <div className="bg-white w-px"></div>
              <input
                type="text"
                value={property[index].value}
                onChange={(event) => {
                  const a = property[index];
                  const obj = {
                    ...a,
                    value: event.target.value,
                  };
                  property.splice(index, 1);
                  const fullArray = [...property, obj];
                  setProperty((preState) => (preState = fullArray));
                }}
                className="bg-gray-100 w-2/4 rounded-tr-md rounded-br-md outline-none px-5"
              />
            </div>
          ))}

          <button
            onClick={addProperty}
            className="rounded w-min border-2 px-5 py-2.5 text-base font-semibold hover:shadow-md transition-all duration-300"
          >
            ADD
          </button>

          <button
            onClick={saveProperty}
            className="rounded w-1/2 self-center bg-blue-500 text-white px-5 py-3 text-base font-semibold hover:shadow-md transition-all duration-300"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertiesModal;
