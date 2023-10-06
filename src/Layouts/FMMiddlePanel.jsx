const FMMiddlePanel = () => {
  return (
    <div className="w-full flex flex-col">
      <div className="w-full flex justify-between px-4">
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
      <div className="w-full mt-5 flex justify-center">
        <table className="w-full">
          <thead>
            <tr className="h-[54px] border-b-[#dee0e4] border-b-[1px] ">
              <th> </th>
              <th className="text-[#212121] font-medium" align="left">
                Name
              </th>
              <th className="text-[#212121] font-medium" align="left">
                Updated
              </th>
              <th className="text-[#212121] font-medium" align="left">
                Size
              </th>
              <th>{"  "}</th>
            </tr>
          </thead>
          <tbody>
            <tr className="h-[54px] border-b-[#dee0e4] border-b-[1px] hover:bg-[#E9F0FD]">
              <td>
                <div className="px-4">
                  <input type="checkbox"></input>
                </div>
              </td>
              <td>
                <div className="pr-4 text-[13px] font-normal text-[#212121]">
                  Video_Name_1.mov
                </div>
              </td>
              <td>
                <div className="pr-4 text-[13px] font-normal text-[#757575]">
                  Yesterday at 6:56 PM by Serhii M...
                </div>
              </td>
              <td>
                <div className="pr-4 text-[13px] font-normal text-[#757575]">
                  3MB
                </div>
              </td>
              <td align="center">
                <div className="flex items-center px-4 h-full">
                  <img
                    src="/public/image/FMDotsIcon.svg"
                    className="w-[24px] h-[24px]"
                    alt="dot icon"
                  />
                </div>
              </td>
            </tr>

            <tr className="h-[54px] border-b-[#dee0e4] border-b-[1px] hover:bg-[#E9F0FD]">
              <td>
                <div className="px-4">
                  <input type="checkbox"></input>
                </div>
              </td>
              <td>
                <div className="pr-4 text-[13px] font-normal text-[#212121]">
                  Video_Name_1.mov
                </div>
              </td>
              <td>
                <div className="pr-4 text-[13px] font-normal text-[#757575]">
                  Yesterday at 6:56 PM by Serhii M...
                </div>
              </td>
              <td>
                <div className="pr-4 text-[13px] font-normal text-[#757575]">
                  3MB
                </div>
              </td>
              <td align="center">
                <div className="flex items-center px-4 h-full">
                  <img
                    src="/public/image/FMDotsIcon.svg"
                    className="w-[24px] h-[24px]"
                    alt="dot icon"
                  />
                </div>
              </td>
            </tr>

            <tr className="h-[54px] border-b-[#dee0e4] border-b-[1px] hover:bg-[#E9F0FD]">
              <td>
                <div className="px-4">
                  <input type="checkbox"></input>
                </div>
              </td>
              <td>
                <div className="pr-4 text-[13px] font-normal text-[#212121]">
                  Video_Name_1.mov
                </div>
              </td>
              <td>
                <div className="pr-4 text-[13px] font-normal text-[#757575]">
                  Yesterday at 6:56 PM by Serhii M...
                </div>
              </td>
              <td>
                <div className="pr-4 text-[13px] font-normal text-[#757575]">
                  3MB
                </div>
              </td>
              <td align="center">
                <div className="flex items-center px-4 h-full">
                  <img
                    src="/public/image/FMDotsIcon.svg"
                    className="w-[24px] h-[24px]"
                    alt="dot icon"
                  />
                </div>
              </td>
            </tr>

            <tr className="h-[54px] border-b-[#dee0e4] border-b-[1px] hover:bg-[#E9F0FD]">
              <td>
                <div className="px-4">
                  <input type="checkbox"></input>
                </div>
              </td>
              <td>
                <div className="pr-4 text-[13px] font-normal text-[#212121]">
                  Video_Name_1.mov
                </div>
              </td>
              <td>
                <div className="pr-4 text-[13px] font-normal text-[#757575]">
                  Yesterday at 6:56 PM by Serhii M...
                </div>
              </td>
              <td>
                <div className="pr-4 text-[13px] font-normal text-[#757575]">
                  3MB
                </div>
              </td>
              <td align="center">
                <div className="flex items-center px-4 h-full">
                  <img
                    src="/public/image/FMDotsIcon.svg"
                    className="w-[24px] h-[24px]"
                    alt="dot icon"
                  />
                </div>
              </td>
            </tr>

            <tr className="h-[54px] border-b-[#dee0e4] border-b-[1px] hover:bg-[#E9F0FD]">
              <td>
                <div className="px-4">
                  <input type="checkbox"></input>
                </div>
              </td>
              <td>
                <div className="pr-4 text-[13px] font-normal text-[#212121]">
                  Video_Name_1.mov
                </div>
              </td>
              <td>
                <div className="pr-4 text-[13px] font-normal text-[#757575]">
                  Yesterday at 6:56 PM by Serhii M...
                </div>
              </td>
              <td>
                <div className="pr-4 text-[13px] font-normal text-[#757575]">
                  3MB
                </div>
              </td>
              <td align="center">
                <div className="flex items-center px-4 h-full">
                  <img
                    src="/public/image/FMDotsIcon.svg"
                    className="w-[24px] h-[24px]"
                    alt="dot icon"
                  />
                </div>
              </td>
            </tr>

            <tr className="h-[54px] border-b-[#dee0e4] border-b-[1px] hover:bg-[#E9F0FD]">
              <td>
                <div className="px-4">
                  <input type="checkbox"></input>
                </div>
              </td>
              <td>
                <div className="pr-4 text-[13px] font-normal text-[#212121]">
                  Video_Name_1.mov
                </div>
              </td>
              <td>
                <div className="pr-4 text-[13px] font-normal text-[#757575]">
                  Yesterday at 6:56 PM by Serhii M...
                </div>
              </td>
              <td>
                <div className="pr-4 text-[13px] font-normal text-[#757575]">
                  3MB
                </div>
              </td>
              <td align="center">
                <div className="flex items-center px-4 h-full">
                  <img
                    src="/public/image/FMDotsIcon.svg"
                    className="w-[24px] h-[24px]"
                    alt="dot icon"
                  />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="mt-10 w-full flex justify-center">
        <button className="bg-[#4489fe] w-[220px] h-[50px] border-[4px] border-[#4489fe] text-white text-sm font-medium">
          Upload Files
        </button>
      </div>
    </div>
  );
};

export default FMMiddlePanel;
