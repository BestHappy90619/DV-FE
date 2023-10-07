import FMTreeView from "../Components/FMTreeView";

const FMTreeSideBar = () => {
  return (
    <div className="flex w-full flex-col pl-4 relative">
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

      <div className="text-[#212121] mt-5 font-bold">Directory</div>
      <div className="flex mt-3">
        <img
          src="/image/FMHomeIcon.svg"
          className="w-[18px] h-[18px]"
          alt="home icon"
        />
        <div className="text-[#212121] text-[13px] font-bold ml-2">Site</div>
      </div>
      <FMTreeView />
    </div>
  );
};

export default FMTreeSideBar;
