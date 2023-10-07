const SearchBox = ({ className }) => {
  return (
    <div className={`${className} flex items-center justify-between`}>
      <div className="flex justify-start items-center">
        <img
          src="/image/SearchIcon.svg"
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
    </div>
  );
};

export default SearchBox;
