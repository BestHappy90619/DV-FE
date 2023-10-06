const FMMiddlePanel = () => {
  return (
    <div className="w-full flex flex-col">
      <div className="w-full flex justify-between mx-2">
        <div className="flex">
          <div className="text-[#757575]">DeskVantage/</div>
          <div className="text-[#212121]">New Folder</div>
        </div>
        <div className="flex justify-end">
          <div className="flex border-r border-[#C4C4C4] gap-2 pr-2">
            <img
              src="/public/image/FMShareIcon.svg"
              className="w-[20px] h-[20px] cursor-pointer"
              alt="icon"
            />
            <img
              src="/public/image/FMEyeIcon.svg"
              className="w-[20px] h-[20px] cursor-pointer"
              alt="icon"
            />
          </div>
          <div className="flex border-r border-[#C4C4C4]  gap-2 px-2">
            <img
              src="/public/image/FMNewFolderIcon.svg"
              className="w-[20px] h-[20px] cursor-pointer"
              alt="icon"
            />
            <img
              src="/public/image/FMStarIcon.svg"
              className="w-[20px] h-[20px] cursor-pointer"
              alt="icon"
            />
            <img
              src="/public/image/FMEditIcon.svg"
              className="w-[20px] h-[20px] cursor-pointer"
              alt="icon"
            />
          </div>
          <div className="flex  gap-2 pl-2">
            <img
              src="/public/image/FMTrashIcon.svg"
              className="w-[20px] h-[20px] cursor-pointer"
              alt="icon"
            />
            <img
              src="/public/image/FMCopyIcon.svg"
              className="w-[19px] h-[19px] cursor-pointer"
              alt="icon"
            />
            <img
              src="/public/image/FMDownloadIcon.svg"
              className="w-[20px] h-[20px] cursor-pointer"
              alt="icon"
            />
          </div>
        </div>
      </div>
      <div className=""></div>
    </div>
  );
};

export default FMMiddlePanel;
