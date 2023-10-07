import FMTreeView from "../Components/FMTreeView";

const FMTreeSideBar = () => {
  return (
    <div className="flex w-full flex-col ml-10 relative">
      <button
        className=" flex items-center justify-center h-[46px] w-[46px] absolute -top-[23px] right-[82px]
        rounded-full shadow-md hover:shadow-lg        
      "
      >
        <img
          src="/image/plus-svgrepo-com.svg"
          className="w-full h-full"
          alt="plus"
        />
      </button>
      <div className="flex mt-5">
        <img
          src="/image/FMHomeIcon.svg"
          className="w-[18px] h-[18px]"
          alt="home icon"
        />
        <div className="text-[#757575]  font-bold ml-2">Home</div>
      </div>
      <FMTreeView />

      <div className="flex">
        <img
          src="/image/FMUsersIcon.png"
          className="w-[20px] h-[20px]"
          alt="home icon"
        />
        <div className="text-[#757575] font-bold ml-2">Available For Me</div>
      </div>

      <div className="flex ">
        <img
          src="/image/FMStarIcon.svg"
          className="w-[20px] h-[20px]"
          alt="home icon"
        />
        <div className="text-[#757575] font-bold ml-2">Favorite</div>
      </div>
    </div>
  );
};

export default FMTreeSideBar;
