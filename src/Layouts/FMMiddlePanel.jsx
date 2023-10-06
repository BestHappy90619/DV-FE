const FMMiddlePanel = () => {
  return (
    <div className="w-full flex flex-col">
      <div className="w-full flex justify-between">
        <div className="">DeskVantage/New Folder</div>
        <div className="flex justify-end">
          <div className="flex border-r border-[#C4C4C4] gap-2 pr-2">
            <img
              src="/public/image/FMShareIcon.svg"
              className="w-[20px] h-[20px]"
              alt="icon"
            />
            <img
              src="/public/image/FMEyeIcon.svg"
              className="w-[20px] h-[20px]"
              alt="icon"
            />
          </div>
          <div className="flex border-r border-[#C4C4C4]  gap-2 px-2">
            <img
              src="/public/image/FMNewFolderIcon.svg"
              className="w-[20px] h-[20px]"
              alt="icon"
            />
            <img
              src="/public/image/FMStarIcon.svg"
              className="w-[20px] h-[20px]"
              alt="icon"
            />
            <img
              src="/public/image/FMEditIcon.svg"
              className="w-[20px] h-[20px]"
              alt="icon"
            />
          </div>
          <div className="flex  gap-2 pl-2">
            <img
              src="/public/image/FMTrashIcon.svg"
              className="w-[20px] h-[20px]"
              alt="icon"
            />
            <img
              src="/public/image/FMCopyIcon.svg"
              className="w-[19px] h-[19px]"
              alt="icon"
            />
            <img
              src="/public/image/FMDownloadIcon.svg"
              className="w-[20px] h-[20px]"
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
