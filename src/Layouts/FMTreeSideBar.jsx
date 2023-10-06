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
        <div className="ml-3 text-sm font-medium font-roboto text-[#757575]">
          Create
        </div>
      </button>
      <FMTreeView />
    </div>
  );
};

export default FMTreeSideBar;
