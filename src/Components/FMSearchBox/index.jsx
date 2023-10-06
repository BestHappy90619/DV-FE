const SearchBox = ({ className }) => {
  return (
    <div className={`${className} flex items-center justify-between`}>
      <div className="flex justify-start items-center">
        <img
          src="/public/image/SearchIcon.svg"
          className="w-[18px] h-[18px]"
          alt="search icon"
        ></img>
        <input
          placeholder="Start typing to search"
          type="text"
          className="text-black text-md bg-transparent  w-full ml-3            
        "
        />
      </div>
      <div className="flex justify-end items-center">
        <div className="text-sm text-[#757575]">All</div>
        <img
          className="ml-3 w-[10px] h-[6px]"
          src="/public/image/SmallDownArrow.svg"
          alt="down arrow"
        ></img>
      </div>
    </div>
  );
};

export default SearchBox;
