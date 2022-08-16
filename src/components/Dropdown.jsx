const Dropdown = ({ onChange, collectionList }) => {
  return (
    <div>
      <select
        className="bg-blue-400 py-4 px-8 rounded-xl text-white font-bold text-xl disabled:bg-blue-200"
        name="collection"
        id="collection"
        placeholder="Select Collection"
        onChange={onChange}
      >
        {collectionList.map((collection, index) => {
          return (
            <option key={index} value={index}>
              {collection.returnValues.name}
            </option>
          );
        })}
      </select>
    </div>
  );
};

export default Dropdown;
