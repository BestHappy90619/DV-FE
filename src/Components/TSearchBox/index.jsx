import { AiOutlineSearch } from "react-icons/ai";

const TSearchBox = ({ className }) => {
  return (
    <div
      className={`${className} flex items-center justify-between rounded-[8px]`}
    >
      <div className="flex justify-start items-center w-full">
        <AiOutlineSearch className="text-2xl ml-4 text-custom-black"/>
        <input
          placeholder="Start typing to search"
          type="text"
          className="text-black text-md bg-transparent  w-full ml-3 outline-none"
        />
      </div>
      
    </div>
  );
};

export default TSearchBox;
