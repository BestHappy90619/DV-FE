import FMTreeView from "../Components/FMTreeView";

const FMTreeSideBar = () => {
  return (
    <div className="flex w-full flex-col ml-10">
      <button
        className=" flex items-center justify-center h-[50px] w-[150px] rounded-[100px] shadow-md hover:shadow-lg
        border  border-[rgb(#000, 30%)] mb-5
      "
      >
        <img
          src="/public/image/PlusFMCreateButton.svg"
          className="w-[20px] h-[20px]"
          alt="plus icon"
        />
        <div className="ml-3  font-medium font-roboto text-[#757575]">
          Create
        </div>
      </button>
      <div className="flex">
        <img
          src="/public/image/FMHomeIcon.svg"
          className="w-[18px] h-[18px]"
          alt="home icon"
        />
        <div className="text-[#757575]  font-bold ml-2">Home</div>
      </div>
      <FMTreeView />

      <div className="flex">
        <img
          src="/public/image/FMUsersIcon.png"
          className="w-[20px] h-[20px]"
          alt="home icon"
        />
        <div className="text-[#757575] font-bold ml-2">Available For Me</div>
      </div>

      <div className="flex ">
        <img
          src="/public/image/FMStarIcon.svg"
          className="w-[20px] h-[20px]"
          alt="home icon"
        />
        <div className="text-[#757575] font-bold ml-2">Favorite</div>
      </div>
    </div>
  );
};

export default FMTreeSideBar;
